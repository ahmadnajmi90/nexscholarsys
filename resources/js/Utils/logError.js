export function logError(error, context = 'Supervision') {
  if (typeof console === 'undefined' || typeof console.error !== 'function') {
    return;
  }

  console.error(`[${context}]`, error);

  if (error?.response) {
    console.error(`[${context}] response`, {
      status: error.response.status,
      data: error.response.data,
      headers: error.response.headers,
    });
  }

  if (error?.request && !error?.response) {
    console.error(`[${context}] request`, error.request);
  }
}

