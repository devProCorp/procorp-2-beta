/**
 * Envío de formularios a JotForm desde el sitio estático.
 *
 * El sitio se publica como export estático: no hay servidor donde guardar una
 * API key, y cualquier clave en el bundle sería pública. JotForm no la necesita
 * para recibir envíos — su endpoint público acepta un POST de formulario normal,
 * así que aquí no hay credencial ninguna. Sólo el ID del formulario, que ya es
 * visible en su URL.
 *
 * El envío no se hace con fetch: submit.jotform.com no devuelve cabeceras CORS,
 * así que un fetch normal fallaría y uno con mode:'no-cors' enviaría a ciegas,
 * sin poder distinguir un envío correcto de uno perdido. En su lugar se hace un
 * envío de formulario nativo contra un iframe oculto, que el navegador permite
 * entre orígenes, y se espera su evento load como confirmación.
 *
 * Los nombres de campo (q3_nombre, q4_email…) los da scripts/jotform-campos.sh.
 */

export interface FormularioJotform {
  /** ID del formulario, el número que aparece en form.jotform.com/<id>. */
  id: string;
  /** Campo del sitio → nombre que espera JotForm (ej. email → q4_email). */
  campos: Record<string, string>;
}

/** Cuánto se espera a JotForm antes de dar el envío por fallido. */
const TIMEOUT_MS = 15000;

export function enviarAJotform(
  formulario: FormularioJotform,
  datos: Record<string, string>
): Promise<void> {
  return new Promise((resolve, reject) => {
    if (typeof document === 'undefined') {
      reject(new Error('enviarAJotform sólo puede ejecutarse en el navegador'));
      return;
    }

    const sinMapear = Object.keys(datos).filter((k) => !formulario.campos[k]);
    if (sinMapear.length > 0) {
      // Fallar aquí es preferible a enviar a JotForm un formulario incompleto:
      // el envío parecería correcto y el dato se perdería en silencio.
      reject(new Error(`Campos sin mapear a JotForm: ${sinMapear.join(', ')}`));
      return;
    }

    const nombreIframe = `jotform-${Date.now()}`;
    const iframe = document.createElement('iframe');
    iframe.name = nombreIframe;
    iframe.style.display = 'none';
    document.body.appendChild(iframe);

    const form = document.createElement('form');
    form.action = `https://submit.jotform.com/submit/${formulario.id}`;
    form.method = 'POST';
    form.target = nombreIframe;
    form.style.display = 'none';

    for (const [campo, valor] of Object.entries(datos)) {
      const input = document.createElement('input');
      input.type = 'hidden';
      input.name = formulario.campos[campo];
      input.value = valor;
      form.appendChild(input);
    }

    document.body.appendChild(form);

    let terminado = false;
    const limpiar = () => {
      clearTimeout(temporizador);
      iframe.removeEventListener('load', alCargar);
      form.remove();
      iframe.remove();
    };

    const alCargar = () => {
      if (terminado) return;
      terminado = true;
      limpiar();
      resolve();
    };

    const temporizador = setTimeout(() => {
      if (terminado) return;
      terminado = true;
      limpiar();
      reject(new Error('JotForm no respondió a tiempo'));
    }, TIMEOUT_MS);

    iframe.addEventListener('load', alCargar);
    form.submit();
  });
}
