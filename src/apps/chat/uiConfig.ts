export const CHAT_TEXT = {
  modeTitle: "¿Como vas a escribir en este chat?",
  modeDescription:
    "Elige si vas a escribir pseudocodigo (por ejemplo, pasos de un algoritmo) o lenguaje natural (explicaciones en texto). Mas adelante usaremos esta eleccion para ajustar el analisis.",
  modePseudocodeLabel: "Pseudocodigo",
  modePseudocodeHint: "Ideal para pasos de algoritmos.",
  modeNaturalLabel: "Lenguaje natural",
  modeNaturalHint: "Describe el problema con tus propias palabras.",
  emptyTitle: "No hay mensajes todavia",
  emptyBodyFirstMessage: "Escribe tu primer mensaje para iniciar el analisis.",
  inputChooseModePlaceholder:
    "Elige primero si usaras pseudocodigo o lenguaje natural en este chat.",
  inputAnalyzingPlaceholder: "Analizando tu mensaje...",
  inputDefaultPlaceholder:
    "Escribe tu mensaje... (Shift+Enter: salto de linea)",
  headerDescription:
    "Analiza fragmentos de codigo y estructuras de control para entender mejor tus algoritmos.",
};

export const ERROR_TEXT = {
  networkFriendly:
    "No se pudo conectar con el servidor. Verifica que el backend este activo y tu conexion funcione.",
  networkHint:
    "Sugerencia: revisa que el backend este levantado y que no haya bloqueos de red o CORS.",
  analysisFriendly:
    "No se pudo analizar tu codigo. Revisa la sintaxis o el tipo de entrada seleccionado.",
  analysisHint:
    "Sugerencia: intenta simplificar el fragmento o corrige posibles errores de sintaxis.",
  genericFriendly: "Ocurrio un problema al procesar tu mensaje.",
  genericHint: "Si el error persiste, intenta de nuevo mas tarde.",
};
