// Secciones numeradas (título + texto con saltos de línea) para las páginas legales propias.
export default function SeccionesLegales({ secciones }: { secciones: { titulo: string; texto: string }[] }) {
  return (
    <>
      {secciones.map((s, i) => (
        <section key={s.titulo}>
          <h2 className="text-white text-xl font-bold mb-2">
            <span className="text-primary mr-2">{String(i + 1).padStart(2, '0')}</span>
            {s.titulo}
          </h2>
          <p className="whitespace-pre-line">{s.texto}</p>
        </section>
      ))}
    </>
  );
}
