# 🚀 Deploy en Vercel

Guía para deployar el Dashboard BI en Vercel.

## Requisitos

- Cuenta en [Vercel](https://vercel.com)
- Git configurado
- Repositorio en GitHub

## Pasos para Deploy

### 1. Conectar Repositorio GitHub

```bash
# Asegurate de haber hecho push a GitHub
git push -u origin claude/glide-api-bi-dashboard-m7ngt2
```

### 2. Accede a Vercel

1. Ve a [https://vercel.com](https://vercel.com)
2. Clickea en "New Project"
3. Importa tu repositorio GitHub `Jaywrkr/COREGESTIONAPI`

### 3. Configurar Variables de Entorno

En la consola de Vercel, agrega estas variables:

```
GLIDE_TOKEN=62348300-4244-472c-a615-920f130c9d51
GLIDE_APP=EqmJ7p1vk6juaq1aLmXi
GLIDE_TABLE=native-table-xtxrom6pVynTPD5o42Ja
```

### 4. Seleccionar Rama

- **Production**: `main` (cuando esté lista)
- **Preview**: `claude/glide-api-bi-dashboard-m7ngt2` (desarrollo actual)

### 5. Build Settings

Los settings están en `vercel.json`:
- **Build Command**: `npm install`
- **Output Directory**: `public`
- **Install Command**: `npm install`

### 6. Deploy

Vercel construirá automáticamente cuando hagas push.

## 🎯 URLs después de Deploy

- **Dashboard**: `https://your-domain.vercel.app`
- **API Data**: `https://your-domain.vercel.app/api/data`
- **API Patterns**: `https://your-domain.vercel.app/api/patterns`
- **API Status**: `https://your-domain.vercel.app/api/status`

## 📊 Ejecutar Análisis en Vercel

### Opción 1: Pre-Deploy (Recomendado)

Los datos se extraen y analizan **antes** del deploy:

```bash
npm run vercel-build
```

### Opción 2: Post-Deploy (Manual)

Si necesitas actualizar datos después del deploy:

1. Clona el repo localmente
2. Ejecuta:
```bash
npm install
npm run extract
npm run analyze
git add data/
git commit -m "Update: Análisis de patrones"
git push
```

## 🔄 CI/CD Automático

**Cada push a la rama** automáticamente:
1. ✅ Instala dependencias
2. ✅ Ejecuta build (`npm run vercel-build`)
3. ✅ Extrae datos de Glide
4. ✅ Analiza patrones
5. ✅ Publica dashboard

## 📁 Estructura en Vercel

```
/public          → Dashboard estático (HTML)
/api            → Serverless Functions (Node.js)
/data           → Datos y patrones (generados en build)
/src            → Scripts de extracción y análisis
vercel.json     → Configuración
```

## 🐛 Troubleshooting

### "No data extracted yet"
- Ejecuta `npm run extract` localmente
- Commit los archivos en `data/`
- Haz push a GitHub

### Errores de Glide API
- Verifica las credenciales en `vercel.json`
- Confirma que el token es válido
- Revisa los logs en Vercel Dashboard

### Timeout en Build
- El análisis puede tardar si hay muchos proyectos
- Aumenta `maxDuration` en `vercel.json` a 60 segundos

## 💡 Tips

1. **Datos Persistentes**: Los archivos en `/data` se regeneran en cada deploy
2. **Caché**: Usa `next.js` o similar para cachear datos
3. **Actualizaciones**: Ejecuta `npm run extract && npm run analyze` regularmente
4. **Monitoreo**: Usa el dashboard de Vercel para monitorear uso

## 🔒 Seguridad

- Las credenciales de Glide están en variables de entorno
- No se commitean tokens en el repositorio
- Los datos de proyectos son públicos (sin información sensible)

---

**Deploy Status**: ✅ Listo para publicar
**Documentación**: Verifica `README.md` para más detalles
