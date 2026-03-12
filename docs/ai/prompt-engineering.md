Anotaré experimentos específicos realizados fuera de la comparativa estándar, como peticiones de refactorización compleja, creación de tests unitarios o resolución de problemas de arquitectura. Se abarcan prompts útiles para trabajar con IA en desarrollo de software.
Cada prompt utiliza técnicas como definición de rol, few-shot prompting, razonamiento paso a paso y restricciones claras.

---

 1. Rol: Desarrollador Senior

Prompt

Actúa como un desarrollador senior especializado en backend.

Analiza el siguiente código y:
1. Explica qué hace
2. Detecta posibles bugs
3. Propón mejoras de rendimiento
4. Sugiere una versión refactorizada

Código:
<pegar código aquí>
```

Por qué funciona

Definir un rol experto mejora la calidad técnica de la respuesta.
La estructura en pasos evita respuestas vagas.
Facilita análisis profundo del código.

---

 2. Generación de código con restricciones claras

Prompt

```
Genera una función en Python que:

- Lea un archivo JSON
- Valide que tenga las claves: id, name y email
- Devuelva una lista de usuarios válidos

Restricciones:
- Usa typing
- Maneja errores
- Incluye docstring estilo Google
- Máximo 40 líneas
```

Por qué funciona

Las restricciones claras reducen ambigüedad.
Obliga al modelo a producir código listo para producción.
Controla el tamaño y el estilo.

---

 3. Few-shot prompting para formato consistente

Prompt

```
Convierte funciones en documentación técnica.

Ejemplo:

Input:
function sum(a,b){ return a+b }

Output:
Descripción: Suma dos números
Parámetros:
- a: número
- b: número
Retorna: número

Ahora haz lo mismo con:

<función aquí>
```

Por qué funciona

Los ejemplos guían el formato de salida.
Reduce errores de estructura.
Ideal para generación repetitiva de docs.

---

4. Refactorización paso a paso

Prompt

```
Refactoriza este código siguiendo estos pasos:

1. Explica los problemas actuales
2. Describe la estrategia de refactorización
3. Muestra la versión mejorada
4. Explica por qué es mejor

Código:
<pegar código>
```

Por qué funciona

El razonamiento paso a paso produce mejoras más cuidadosas.
Hace visible la lógica detrás de la solución.

---

5. Conversión de código entre lenguajes

Prompt

```
Actúa como experto en migración de software.

Convierte este código de JavaScript a Python.

Requisitos:
- Mantener la lógica original
- Usar buenas prácticas de Python
- Explicar diferencias importantes

Código:
<codigo>
```

Por qué funciona**

Define contexto experto específico.
Evita traducciones literales incorrectas.

---

6. Generación de tests

Prompt

```
Eres un ingeniero QA senior.

Genera tests unitarios para esta función.

Requisitos:
- Usar pytest
- Cubrir casos normales
- Cubrir edge cases
- Cubrir errores

Función:
<codigo>
```

Por qué funciona

El rol dirige el modelo a pensar en calidad y cobertura.
Las categorías de tests mejoran el resultado.

---

7. Explicación para nuevos desarrolladores

Prompt

```
Explica el siguiente código como si el lector fuera
un desarrollador junior.

Incluye:
- explicación general
- explicación línea por línea
- diagrama conceptual simple

Código:
<codigo>
```

Por qué funciona

 Cambia el nivel pedagógico de la respuesta.
 Mejora la claridad para onboarding.

---

8. Mejora de rendimiento

Prompt

```
Actúa como experto en optimización.

Analiza el siguiente código y:

1. Identifica cuellos de botella
2. Explica su impacto
3. Propón optimizaciones
4. Muestra código optimizado

Código:
<codigo>
```

Por qué funciona

Obliga al modelo a hacer análisis antes de modificar.
Evita cambios innecesarios.

---

9. Generación de documentación del proyecto

Prompt

```
Genera documentación README para este proyecto.

Incluye:
- descripción
- instalación
- uso
- ejemplos
- estructura de carpetas
- contribución

Información del proyecto:
<descripcion>
```

Por qué funciona

Define claramente las secciones esperadas.
Produce documentación estándar.

---

10. Revisión de Pull Request

Prompt

```
Actúa como reviewer de código en un Pull Request.

Analiza este cambio y responde con:

- problemas detectados
- sugerencias de mejora
- posibles bugs
- comentario final como reviewer

Diff:
<diff>
```

Por qué funciona

Simula el proceso real de revisión de código.
Genera feedback estructurado y útil.
Reduce la probabilidad de errores en producción.

---

Conclusión

Los prompts funcionan bien porque combinan:

-Roles expertos
-Restricciones claras
-Ejemplos (few-shot)
-Razonamiento paso a paso
-Estructura en la salida

Estas técnicas mejoran la precisión, consistencia y utilidad de las respuestas generadas por IA.
