Recopilaré los prompts que mejor resultado me han dado, analizando cómo la estructura, el contexto y las instrucciones específicas influyen en la precisión de las respuestas de la IA.

Experimento 1: Comprobar si un número es primo
Problema

Crear una función que determine si un número es primo.

Mi forma:

def is_prime(n):
    if n <= 1:
        return False

    for i in range(2, n):
        if n % i == 0:
            return False

    return True
Características

Solución usando IA

import math

def is_prime(n: int) -> bool:
    """Check if a number is prime."""

    if n <= 1:
        return False

    for i in range(2, int(math.sqrt(n)) + 1):
        if n % i == 0:
            return False

    return True
Mejoras

Usa sqrt(n) para optimizar

Añade type hints

Incluye docstring

Crear una función que cuente cuántas veces aparece cada palabra en un texto.

Solución mía:


def count_words(text):
    words = text.split()
    result = {}

    for w in words:
        if w in result:
            result[w] += 1
        else:
            result[w] = 1

    return result

Solución usando IA:


from collections import Counter

def count_words(text: str) -> dict:
    """Count occurrences of words in text."""
    words = text.lower().split()
    return dict(Counter(words))


Crear una función que devuelva el número más grande de una lista.

Solución mía:



def find_max(numbers):
    max_value = numbers[0]

    for n in numbers:
        if n > max_value:
            max_value = n

    return max_value

Solución usando IA:



def find_max(numbers: list[int]) -> int:
    """Return the largest number in a list."""
    return max(numbers)


La IA reduce significativamente el tiempo de desarrollo, especialmente para tareas simples.

El código generado por IA suele ser más optimizado o idiomático.

El programador sigue necesitando comprender el problema, ya que la IA puede generar soluciones incorrectas si el prompt es ambiguo.

La mejor estrategia es usar IA como herramienta de apoyo, no como sustituto del razonamiento del desarrollador.

Reflexión final:

La IA mejora la velocidad de desarrollo y ayuda a encontrar soluciones más limpias.
Sin embargo, la comprensión del problema y la capacidad de evaluar la calidad del código siguen siendo responsabilidades del programador.