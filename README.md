# Glide BI Dashboard - Proyectos de Gestión

Dashboard de Business Intelligence para analizar patrones en proyectos de gestión extraídos de Glide.

## 🎯 Objetivos

- **Extrae datos reales** de la tabla Proyectos Gestión de Glide
- **Descubre patrones** y anomalías en los datos
- **Visualiza KPIs** con dashboard interactivo
- **Identifica riesgos** en proyectos

## 📊 Funcionalidades

### 1. Extracción de Datos
```bash
npm run extract
```
- Extrae datos reales de la tabla de Glide
- Guarda en `data/proyectos-gestion-extracted.json`

### 2. Análisis de Patrones
```bash
npm run analyze
```
Analiza y detecta:
- Distribución de estados de proyectos
- Completitud de documentación
- Proyectos retrasados
- Administradores principales
- Formas de pago
- **Proyectos en riesgo** (documentación incompleta + retrasos)

### 3. Dashboard Interactivo
```bash
npm start
```
Accede a: `http://localhost:3000`

**Tabs disponibles:**
- 📋 **General**: Resumen, gráficos de estados
- 📄 **Documentación**: Completitud de cada documento requerido
- ⚠️ **Riesgos**: Proyectos retrasados y en riesgo
- 📊 **Datos**: Tabla completa de proyectos

## 📁 Estructura

```
src/
├── config/
│   └── proyectosGestion.js    # Configuración de tabla Glide
├── scripts/
│   ├── extractData.js          # Extrae datos de Glide
│   └── analyzePatterns.js      # Analiza patrones
└── server.js                   # Servidor Express

data/
├── proyectos-gestion-extracted.json  # Datos crudos
└── patterns.json                      # Patrones analizados

public/
└── index.html                   # Dashboard web
```

## 🔍 Patrones Detectados

### Completitud de Documentación
- Adjudicación
- Acta de Negociación
- Contrato
- Póliza Fiel
- Póliza Buen Uso
- Acta Entrega-Recepción

### Detección de Riesgos
Un proyecto se marca como **EN RIESGO** si:
- Tiene documentación incompleta (>3 campos)
- Está retrasado (fecha fin < hoy y aún en curso/validación)

### Análisis de Retrasos
- Compara fecha planificada vs hoy
- Identifica proyectos vencidos pero sin cerrar

## 📈 KPIs Principales

1. **Total de Proyectos**: Cantidad total
2. **Proyectos Activos**: Estado "En Curso"
3. **Proyectos Completados**: Estado "Completado"
4. **Valor Total**: Suma de presupuestos
5. **Proyectos en Riesgo**: % de proyectos críticos
6. **Proyectos Retrasados**: % vencidos sin cerrar

## 🚀 Instalación

```bash
npm install
npm run extract
npm run analyze
npm start
```

## 📝 Tabla de Referencia

**Columna** → **Campo Glide**
- Código: `column1`
- Nombre: `column2`
- Administración: `administraciN`
- Cliente: `column4`
- Estado: `column5`
- Fecha Inicio: `column6`
- Fecha Fin: `column7`
- Valor: `column8`
- Administrador: `administrador`
- Forma de Pago: `formaDePago`

**Documentos (Booleanos)**
- Adjudicación: `adjudicacion`
- Acta Negociación: `actaDeNegociacion`
- Contrato: `contrato`
- Póliza Fiel: `polizaFiel`
- Póliza Buen Uso: `polizaBuen`
- Acta Entrega: `actaEntregaRecepcion`

## 🔐 Credenciales Glide

```javascript
token: "62348300-4244-472c-a615-920f130c9d51"
app: "EqmJ7p1vk6juaq1aLmXi"
table: "native-table-xtxrom6pVynTPD5o42Ja"
```

## 📡 API Endpoints

- `GET /api/data` - Datos extraídos
- `GET /api/patterns` - Patrones analizados
- `GET /api/status` - Estado del sistema
- `GET /health` - Health check

## 🎨 Visualizaciones

- Gráficos de distribución (Doughnut)
- Gráficos de barras (Top administradores)
- Tablas interactivas
- Barras de progreso (Completitud)
- Badges de estado

---

**Última actualización**: 2026-09-04
