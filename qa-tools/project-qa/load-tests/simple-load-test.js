#!/usr/bin/env node
/**
 * Prueba de Carga Simple - Alternativa a JMeter
 * Autor: Eddy Alexander Ramirez Lorenzana
 * Fecha: 06/09/2025
 */

const https = require('https');
const http = require('http');
const { performance } = require('perf_hooks');

class LoadTestResults {
    constructor() {
        this.requests = [];
        this.errors = [];
        this.startTime = null;
        this.endTime = null;
    }

    addRequest(url, statusCode, responseTime, error = null) {
        const result = {
            url,
            statusCode,
            responseTime,
            timestamp: new Date().toISOString(),
            success: statusCode >= 200 && statusCode < 400 && !error
        };
        
        if (error) {
            result.error = error.message;
            this.errors.push(result);
        }
        
        this.requests.push(result);
    }

    getStatistics() {
        const successful = this.requests.filter(r => r.success);
        const failed = this.requests.filter(r => !r.success);
        const responseTimes = successful.map(r => r.responseTime);
        
        const duration = this.endTime - this.startTime;
        const totalRequests = this.requests.length;
        
        return {
            duration_ms: Math.round(duration),
            duration_seconds: Math.round(duration / 1000),
            total_requests: totalRequests,
            successful_requests: successful.length,
            failed_requests: failed.length,
            success_rate: Math.round((successful.length / totalRequests) * 100),
            throughput_rps: Math.round(totalRequests / (duration / 1000)),
            response_times: {
                min: Math.min(...responseTimes) || 0,
                max: Math.max(...responseTimes) || 0,
                avg: Math.round(responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length) || 0,
                p50: this.percentile(responseTimes, 50),
                p90: this.percentile(responseTimes, 90),
                p95: this.percentile(responseTimes, 95),
                p99: this.percentile(responseTimes, 99)
            },
            errors_by_status: this.groupErrorsByStatus()
        };
    }

    percentile(arr, p) {
        if (arr.length === 0) return 0;
        const sorted = arr.sort((a, b) => a - b);
        const index = Math.ceil((p / 100) * sorted.length) - 1;
        return Math.round(sorted[index]);
    }

    groupErrorsByStatus() {
        const errorCounts = {};
        this.errors.forEach(error => {
            const key = error.statusCode || 'CONNECTION_ERROR';
            errorCounts[key] = (errorCounts[key] || 0) + 1;
        });
        return errorCounts;
    }
}

class SimpleLoadTester {
    constructor(baseUrl = 'http://localhost:3000') {
        this.baseUrl = baseUrl;
        this.results = new LoadTestResults();
        this.client = baseUrl.startsWith('https') ? https : http;
    }

    async makeRequest(url, timeout = 5000) {
        return new Promise((resolve) => {
            const startTime = performance.now();
            const fullUrl = url.startsWith('http') ? url : `${this.baseUrl}${url}`;
            
            const req = this.client.get(fullUrl, (res) => {
                const endTime = performance.now();
                const responseTime = Math.round(endTime - startTime);
                
                this.results.addRequest(url, res.statusCode, responseTime);
                resolve();
            });

            req.on('error', (error) => {
                const endTime = performance.now();
                const responseTime = Math.round(endTime - startTime);
                
                this.results.addRequest(url, 0, responseTime, error);
                resolve();
            });

            req.setTimeout(timeout, () => {
                req.destroy();
                const endTime = performance.now();
                const responseTime = Math.round(endTime - startTime);
                
                this.results.addRequest(url, 0, responseTime, new Error('Request timeout'));
                resolve();
            });
        });
    }

    async runConcurrentRequests(urls, concurrency, duration) {
        const endTime = Date.now() + (duration * 1000);
        const promises = [];

        console.log(`Iniciando prueba de carga:`);
        console.log(`- Concurrencia: ${concurrency} requests simultáneos`);
        console.log(`- Duración: ${duration} segundos`);
        console.log(`- URLs objetivo: ${urls.length}`);
        console.log(`- Endpoint: ${this.baseUrl}`);
        console.log('');

        this.results.startTime = performance.now();

        while (Date.now() < endTime) {
            // Crear batch de requests concurrentes
            for (let i = 0; i < concurrency; i++) {
                const url = urls[Math.floor(Math.random() * urls.length)];
                promises.push(this.makeRequest(url));
            }

            // Esperar a que el batch actual termine
            await Promise.all(promises.splice(0, concurrency));
            
            // Pequeña pausa para evitar saturar completamente
            await new Promise(resolve => setTimeout(resolve, 10));
        }

        // Esperar requests pendientes
        await Promise.all(promises);
        this.results.endTime = performance.now();
    }

    printResults() {
        const stats = this.results.getStatistics();
        
        console.log('\n' + '='.repeat(60));
        console.log('RESULTADOS DE PRUEBA DE CARGA');
        console.log('='.repeat(60));
        console.log(`Duración Total: ${stats.duration_seconds} segundos`);
        console.log(`Total de Requests: ${stats.total_requests}`);
        console.log(`Requests Exitosos: ${stats.successful_requests}`);
        console.log(`Requests Fallidos: ${stats.failed_requests}`);
        console.log(`Tasa de Éxito: ${stats.success_rate}%`);
        console.log(`Throughput: ${stats.throughput_rps} requests/segundo`);
        console.log('');
        console.log('TIEMPOS DE RESPUESTA (ms):');
        console.log(`  Mínimo: ${stats.response_times.min}ms`);
        console.log(`  Máximo: ${stats.response_times.max}ms`);
        console.log(`  Promedio: ${stats.response_times.avg}ms`);
        console.log(`  Percentil 50: ${stats.response_times.p50}ms`);
        console.log(`  Percentil 90: ${stats.response_times.p90}ms`);
        console.log(`  Percentil 95: ${stats.response_times.p95}ms`);
        console.log(`  Percentil 99: ${stats.response_times.p99}ms`);
        
        if (Object.keys(stats.errors_by_status).length > 0) {
            console.log('');
            console.log('ERRORES POR CÓDIGO:');
            Object.entries(stats.errors_by_status).forEach(([status, count]) => {
                console.log(`  ${status}: ${count} errores`);
            });
        }
        
        console.log('='.repeat(60));
        
        return stats;
    }

    async saveResults(filename = 'load-test-results.json') {
        const stats = this.results.getStatistics();
        const fullResults = {
            test_info: {
                date: new Date().toISOString(),
                base_url: this.baseUrl,
                tester: 'Eddy Alexander Ramirez Lorenzana'
            },
            statistics: stats,
            raw_results: this.results.requests
        };
        
        const fs = require('fs');
        fs.writeFileSync(filename, JSON.stringify(fullResults, null, 2));
        console.log(`Resultados guardados en: ${filename}`);
    }
}

// Configuración de la prueba
const BASE_URL = 'http://localhost:3000';
const ENDPOINTS_TO_TEST = [
    '/',           // Ruta raíz
    '/health'      // Health check
];

// Parámetros de la prueba
const CONCURRENCY = 5;        // Requests concurrentes
const DURATION = 30;          // Duración en segundos

async function runLoadTest() {
    const tester = new SimpleLoadTester(BASE_URL);
    
    console.log('INICIANDO PRUEBA DE CARGA SIMPLE');
    console.log('Sistema: CISNET - Software Sales System');
    console.log(`Fecha: ${new Date().toLocaleString()}`);
    console.log('Nota: Alternativa a JMeter usando Node.js\n');
    
    try {
        await tester.runConcurrentRequests(ENDPOINTS_TO_TEST, CONCURRENCY, DURATION);
        const stats = tester.printResults();
        await tester.saveResults();
        
        // Validar criterios de aceptación
        console.log('\nVALIDACIÓN DE CRITERIOS:');
        const criteria = {
            'Tiempo promedio < 2000ms': stats.response_times.avg < 2000,
            'Percentil 95 < 5000ms': stats.response_times.p95 < 5000,
            'Tasa de error < 1%': (100 - stats.success_rate) < 1,
            'Throughput > 10 RPS': stats.throughput_rps > 10
        };
        
        Object.entries(criteria).forEach(([criterion, passed]) => {
            const status = passed ? '✅ CUMPLE' : '❌ NO CUMPLE';
            console.log(`  ${status}: ${criterion}`);
        });
        
        const allPassed = Object.values(criteria).every(Boolean);
        console.log(`\nRESULTADO GENERAL: ${allPassed ? '✅ APROBADO' : '❌ NECESITA MEJORAS'}`);
        
    } catch (error) {
        console.error('Error ejecutando prueba de carga:', error.message);
        process.exit(1);
    }
}

// Ejecutar si es llamado directamente
if (require.main === module) {
    runLoadTest().catch(console.error);
}

module.exports = { SimpleLoadTester, LoadTestResults };