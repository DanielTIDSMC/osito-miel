# Un poquito de miel

PWA para guardar recuerdos, planes y lugares en pareja. Incluye modo oscuro, funciona sin conexión tras la primera visita y guarda los cambios locales en el navegador.

## Lugares del chat

El álbum incluye lugares y reseñas que aparecen en el chat exportado, además de fotos identificadas por el contexto del mensaje. Las fechas quedan como “Fecha por confirmar” cuando el chat no especifica cuándo fueron.

Cada tarjeta tiene la opción **Cambiar foto**. La imagen nueva se optimiza y queda guardada localmente; al conectar la sincronización, también se comparte con el otro dispositivo. Para sincronizar, cada foto puede pesar hasta 2 MB y el conjunto de fotos del álbum hasta 7 MB.

**Privacidad:** las fotos del chat y la lista de lugares están incluidas en los archivos estáticos del sitio de GitHub Pages. Cualquiera que tenga el enlace público puede acceder a esos archivos. Las nuevas fotos y recuerdos creados dentro de la app permanecen en el dispositivo hasta conectar la sincronización.

## Probar localmente

Desde esta carpeta, inicia un servidor web local (por ejemplo, Live Server en VS Code) y abre su dirección `localhost`. El service worker no funciona si se abre el HTML directamente como `file://`.

## Publicar la PWA

Sube el contenido de esta carpeta al repositorio `DanielTIDSMC/osito-miel` y activa **Settings → Pages → Deploy from a branch**, usando `main` y `/(root)`. Pages sirve por HTTPS, necesario para instalar y usar el modo sin conexión.

## Sincronización privada entre dispositivos

La sincronización es opcional y usa el backend Node incluido en `backend/`, como un servicio Railway nuevo e independiente de HeroPulse:

1. Despliega la raíz de este repositorio como un servicio Node en Railway (Node 20 o superior).
2. En el servicio configura `ROOM_PASSWORD` con una clave aleatoria de al menos 32 bytes. Genérala localmente y no la publiques ni la envíes por chat.
3. Añade un volumen persistente montado en `/data` y configura `DATA_FILE=/data/state.json`.
4. Configura `ALLOWED_ORIGINS=https://danieltidsmc.github.io`.
5. Espera a que Railway despliegue y comprueba que la URL del servicio termine en `/health` con la respuesta `{"status":"ok"}`.
6. En el apartado **Compartir nuestros recuerdos** de la PWA, introduce la URL base de Railway y la misma clave en ambos dispositivos.

La conexión usa HTTPS y requiere la clave compartida para leer o escribir el estado. Railway conserva una copia de los datos enviados en el volumen configurado; no se debe considerar un servicio cifrado de extremo a extremo. Sin internet, los cambios permanecen localmente y se sincronizan cuando vuelva la conexión. No desconectes ni borres los datos del navegador antes de que la app indique que terminó de sincronizar.

La API se puede probar con `npm run test:api`.
