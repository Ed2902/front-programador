import React, { useEffect, useState, useMemo } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import "./Analitica.css";

const COLORS = [
  "#0088FE","#FF8042","#FFBB28","#FF8042","#A28BFE",
  "#FF6384","#36A2EB","#FFCE56","#8DD1E1","#82CA9D"
];

const Analitica = () => {
  const [data, setData] = useState(null);     
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

   
    const url = "/components/GestionBodega/inventario.json";

    (async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(url, { signal: controller.signal });
        console.log("[Analitica] fetch", url, "status:", res.status, res.statusText);
        console.log("[Analitica] content-type:", res.headers.get("content-type"));

        const text = await res.text();
        console.log("[Analitica] response first chars:", text.slice(0, 200));

        if (text.trim().startsWith("<")) {
          console.warn("[Analitica] La respuesta parece HTML (probable fallback de SPA). Intentando import desde src...");
          try {
            const mod = await import("./inventario.json");
            const json = mod?.default ?? mod;
            console.log("[Analitica] import fallback success, elementos:", (json || []).length);
            setData(json);
            setLoading(false);
            return;
          } catch (impErr) {
            console.error("[Analitica] import fallback falló:", impErr);
            setError("Respuesta no es JSON y el fallback por import falló. Revisa la ruta o pon el archivo en public/data.");
            setLoading(false);
            return;
          }
        }

        try {
          const json = JSON.parse(text);
          console.log("[Analitica] JSON parse OK, items:", (json || []).length);
          setData(json);
          setLoading(false);
        } catch (parseErr) {
          console.error("[Analitica] Error parseando JSON:", parseErr);
          setError("No se pudo parsear el JSON. Revisa el formato del archivo.");
          setLoading(false);
        }
      } catch (err) {
        if (err.name === "AbortError") return;
        console.error("[Analitica] fetch error:", err);
        setError(err.message || "Error al cargar el JSON");
        setLoading(false);
      }
    })();

    return () => controller.abort();
        }, []);

  // console.log ("[Analitica] data", data);
  
const barData = useMemo(() => {
    if (!data) return [];
    const arr = data.map((it) => ({
      name: it.Nombre || "SIN_NOMBRE",
      cantidad: Number(it.Cantidad || 0),
      fecha: it.Fecha_ultimo_registri,
     
    }));
    const sorted = arr.sort((a, b) => b.cantidad - a.cantidad);
    console.log("[Analitica] barData", sorted);
    return sorted;
  }, [data]);

  const pieData = useMemo(() => {
    if (!data) return [];
    const grouped = data.reduce((acc, it) => {
      const pref = (it.id_producto || "").split("-")[0] || "OTROS";
      acc[pref] = (acc[pref] || 0) + Number(it.Cantidad || 0);
      return acc;
    }, {});
    const out = Object.entries(grouped).map(([name, value]) => ({ name, value }));
    console.log("[Analitica] pieData", out);
    return out;
  }, [data]);

  const total = useMemo(() => {
    if (!data) return 0;
    return data.reduce((s, it) => s + Number(it.Cantidad || 0), 0);
  }, [data]);

  if (loading) {
    return (
      <div className="analitica-loading">
        <h3>Cargando inventario…</h3>
        <p>Un momento por favor.</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="analitica-error">
        <h3>Error al cargar datos</h3>
        <p>{error}</p>
        <pre className="analitica-error-pre">
          Revisa la URL del fetch, Network tab y que el archivo exista en public/.
        </pre>
      </div>
    );
  }

  return (
    <div className="analitica-container">
      <h2 className="analitica-title">Analítica de inventario — Bodega BOG005</h2>

      <div className="analitica-grid">
        <div className="card">
          <h3 className="card-title">Cantidad por producto (ordenado)</h3>
          <div className="chart-container">
            <ResponsiveContainer>
              <BarChart data={barData} margin={{ top: 10, right: 20, left: 10, bottom: 60 }}>
                <CartesianGrid strokeDasharray="3 3" />
                
                <YAxis />
                <Tooltip formatter={(value) => value.toLocaleString()} />
                <Legend />
                <Bar dataKey="cantidad" fill="#FF8042" name="Cantidad" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="grid-two">
          <div className="card pie-card">
            <h3 className="card-title">Distribución por familia (prefijo)</h3>
            <div className="chart-container chart-small">
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                    outerRadius={100}
                    label={(entry) => `${entry.name}: ${Math.round((entry.value / total) * 100)}%`}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => value.toLocaleString()} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="card summary-card">
            <h3 className="card-title">Resumen</h3>
            <p><strong>Total items (suma de cantidades):</strong> {total.toLocaleString()}</p>
            <p><strong>Productos en la vista:</strong> {barData.length}</p>

            <h4>Top 5 por cantidad</h4>
            <ol>
              {barData.slice(0, 5).map((p) => (
                <li key={p.name}>
                  {p.name} — {p.cantidad.toLocaleString()}
                </li>
              ))}
            </ol>
          </div>
        </div>

        

      </div>
    </div>
  );
};

export default Analitica;
