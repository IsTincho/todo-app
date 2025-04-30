import { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [count, setCount] = useState(null);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/admin/count")
      .then((res) => setCount(res.data.count))
      .catch((err) => console.error(err));
  }, []);

  console.log(
    "%cToDo App cargada correctamente",
    "color: red; font-weight: bold;"
    //console log duplicado por el stric mode
  );

  //una vista base para checkear todo en orden antes del primer commit

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-100 gap-4">
      <h1 className="text-3xl font-bold text-red-600">ToDo App</h1>
      <p className="text-lg text-gray-700">
        Usuarios registrados en la base:{" "}
        <span className="font-semibold">{count ?? "Cargando..."}</span>
      </p>
    </div>
  );
}

export default App;
