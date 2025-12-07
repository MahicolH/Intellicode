Intellicode — Demo local

Descripción
- Sitio web de ejemplo para la venta de proyectos: roles de comprador, vendedor y admin.
- Implementado con HTML/CSS/JS sin servidor; los datos se guardan en `localStorage`.

Cómo abrir
1. Abrir `index.html` en el navegador (doble clic o `File > Open` en el navegador).

Notas importantes
- No se crean datos simulados por defecto. Después de registrarte, tu cuenta se guarda en el navegador.
- Para crear una cuenta admin al registrarte, selecciona el rol "Admin" y pon el código: `intellicode-admin-2025`.
- El rol vendedor deberá pagar la membresía en un flujo futuro; por ahora se muestra una etiqueta indicando que requiere membresía.
- Subidas de archivos se guardan en `localStorage` como dataURL (útil para demostración). Para producción debes implementar un backend y almacenamiento apropiado.

Estructura de almacenamiento (localStorage)
- `ic_users`: array de usuarios
- `ic_projects`: array de proyectos
- `ic_current`: id del usuario actualmente autenticado

Siguientes pasos recomendados
- Integrar backend (API) para persistencia segura y gestión de archivos.
- Implementar pasarela de pago para membresías y compras.
- Añadir búsquedas, filtros por categoría y valoraciones.

Si quieres, puedo:
- Añadir validaciones adicionales y UX.
- Crear un backend básico (Node.js + Express) para manejar subida de archivos.
- Integrar Stripe/PayPal para la membresía de vendedor.

