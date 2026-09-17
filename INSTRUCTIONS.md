# Práctica 2.1 — Repositorios y Forks

Guía paso a paso para completar la práctica usando **Fastify + EJS** como framework.

---

## 1. Crear el repositorio oficial

1. Crear una **organización** en GitHub (ej. `ti-integrador-scr2`).
2. Dentro de la organización, crear el repo `pr-forks`.
3. Subir el código del proyecto (server.js, views/, package.json, package-lock.json).
4. **NO subir** `node_modules/`. Asegurar que exista un `.gitignore`:

```
node_modules/
```

5. El título del repo oficial debe ser el nombre del proyecto: `pr-forks`.

---

## 2. Forkear el repositorio

Cada integrante del grupo hace **fork** del repositorio oficial a su cuenta personal.

```
En GitHub → Botón "Fork" → Seleccionar tu cuenta
```

Clonar tu fork localmente:

```bash
git clone https://github.com/TU-USERNAME/pr-forks.git
cd pr-forks
npm install
```

---

## 3. Headers — Título con nombre del programador

**En cada fork**, el `<h1>` del `views/index.ejs` debe mostrar el nombre del programador.

Ejemplo para Alex:

```html
<h1>Repositorio Oficial: pr-forks</h1>
<h3 style="text-align:right; color:#666; margin-top:-1rem;">by Alex</h3>
```

Cada quien cambia `by Alex` por su nombre.

**En el repo oficial**, el título se queda como `Repositorio Oficial: pr-forks` sin nombre de autor.

---

## 4. Crear las 3 ramas feat/

Desde tu fork, crear 3 ramas de feature. Cada rama debe editar **un solo archivo** (máximo 2 archivos para generar conflictos).

```bash
git checkout -b feat/agregar-busqueda
```

### feat/agregar-busqueda

Agregar un campo de búsqueda en `views/index.ejs`:

```html
<!-- Agregar después del form de agregar -->
<input type="text" id="busqueda" placeholder="Buscar tarea..." onkeyup="filtrar()">
```

```javascript
// Agregar antes de </body>
<script>
function filtrar() {
  const input = document.getElementById('busqueda').value.toLowerCase();
  document.querySelectorAll('li').forEach(li => {
    const text = li.textContent.toLowerCase();
    li.style.display = text.includes(input) ? '' : 'none';
  });
}
</script>
```

```bash
git add views/index.ejs
git commit -m "feat: agregar barra de búsqueda"
```

### feat/agregar-contador

Agregar un contador de tareas en `views/index.ejs`:

```html
<!-- Agregar antes del <ul> -->
<p>Total: <%= todos.length %> tareas | Completadas: <%= todos.filter(t => t.done).length %></p>
```

```bash
git add views/index.ejs
git commit -m "feat: agregar contador de tareas"
```

### feat/agregar-categoria

Agregar un campo de categoría al formulario y mostrarlo en la lista. Editar `views/index.ejs` y `server.js`.

En `views/index.ejs`, modificar el form:

```html
<form action="/add" method="POST" class="add-form">
  <input type="text" name="text" placeholder="Nueva tarea..." required>
  <select name="category">
    <option value="personal">Personal</option>
    <option value="trabajo">Trabajo</option>
    <option value="escuela">Escuela</option>
  </select>
  <button type="submit">Agregar</button>
</form>
```

En la lista, mostrar la categoría:

```html
<span class="category">[<%= todo.category || 'sin categoría' %>]</span>
```

En `server.js`, modificar la ruta `/add`:

```javascript
const newTodo = {
  id: todos.length > 0 ? Math.max(...todos.map(t => t.id)) + 1 : 1,
  text,
  category: request.body.category || 'personal',
  done: false
};
```

```bash
git add views/index.ejs server.js
git commit -m "feat: agregar sistema de categorías"
```

---

## 5. Merge a dev y a main desde cada fork

Después de terminar cada feature, hacer merge a `dev` y luego a `main`:

```bash
# Desde la rama feat/
git checkout dev
git merge feat/agregar-busqueda
git checkout main
git merge dev
git push origin main
```

Repetir para cada rama `feat/`.

**Importante:** Si trabajas solo en un archivo, puede haber conflictos al hacer merge. Resuélvelos editando el archivo y dejando ambos cambios.

---

## 6. Modificaciones hotfix y bugfix en el repo oficial

El profesor (o quien administre el repo oficial) hace 2 cambios directamente en el repo oficial:

### Hotfix (en el repo oficial)

```bash
git checkout main
git checkout -b hotfix/seguridad
```

Agregar validación en `server.js`:

```javascript
// En la ruta /add, agregar validación
fastify.post('/add', async (request, reply) => {
  const { text, category } = request.body;
  if (!text || text.trim().length === 0) {
    return reply.redirect('/');
  }
  // ... resto del código
});
```

```bash
git add server.js
git commit -m "hotfix: validar entrada vacía"
git checkout main
git merge hotfix/seguridad
git push origin main
```

### Bugfix (en el repo oficial)

```bash
git checkout -b bugfix/fix-toggle
```

Corregir la ruta `/toggle/:id` en `server.js`:

```javascript
fastify.post('/toggle/:id', async (request, reply) => {
  const { id } = request.params;
  const todo = todos.find(t => t.id === parseInt(id));
  if (todo) {
    todo.done = !todo.done;
  }
  return reply.redirect('/');
});
```

```bash
git add server.js
git commit -m "bugfix: corregir toggle de completado"
git checkout main
git merge bugfix/fix-toggle
git push origin main
```

---

## 7. Transferir hotfix y bugfix a cada fork

Cada integrante sincroniza su fork con el repo oficial:

```bash
# Agregar el repo oficial como remoto
git remote add upstream https://github.com/ti-integrador-scr2/pr-forks.git

# Traer los cambios
git fetch upstream

# Merge a main
git checkout main
git merge upstream/main
git push origin main
```

---

## 8. Pull Requests (PRs)

Cada vez que hagas cambios en tu fork y quieras contribute al repo oficial:

1. Push de tu rama a tu fork:
   ```bash
   git push origin main
   ```

2. Ir a GitHub → tu fork → **"Contribute"** → **"Open pull request"**

3. Seleccionar:
   - **Base:** `ti-integrador-scr2/pr-forks` ← `main`
   - **Compare:** `TU-USERNAME/pr-forks` ← `main`

4. Poner título descriptivo: `feat: agregar búsqueda - Alex`

5. Crear el PR.

---

## 9. Resolver conflictos en PRs

Si hay conflictos en la PR:

```bash
# En tu fork local
git checkout main
git fetch upstream
git merge upstream/main

# Git te mostrará conflictos en los archivos
# Abrir el archivo y buscar los marcadores:
# <<<<<<< HEAD
# (tu código)
# =======
# (código del upstream)
# >>>>>>> upstream/main

# Editar, dejar ambos cambios, guardar

git add .
git commit -m "resolve: conflictos con upstream"
git push origin main
```

La PR se actualizará automáticamente.

---

## 10. Mantener main actualizado

Siempre antes de trabajar, sincronizar:

```bash
git checkout main
git fetch upstream
git merge upstream/main
git push origin main
```

---

## Resumen de ramas

```
main
├── dev
│   ├── feat/agregar-busqueda
│   ├── feat/agregar-contador
│   └── feat/agregar-categoria
├── hotfix/seguridad
└── bugfix/fix-toggle
```

## Archivos modificados

| Archivo | Quién lo edita |
|---------|---------------|
| `server.js` | Todos (cada fork lo modifica) |
| `views/index.ejs` | Todos (cada fork lo modifica) |
| `.gitignore` | Solo el repo oficial |

---

## Comandos rápidos

```bash
# Clonar fork
git clone https://github.com/TU-USERNAME/pr-forks.git

# Instalar dependencias
npm install

# Ejecutar
node server.js

# Sincronizar con oficial
git remote add upstream https://github.com/ti-integrador-scr2/pr-forks.git
git fetch upstream
git merge upstream/main
```
