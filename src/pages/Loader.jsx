import { useEffect, useState } from "react";

function Loader() {

  const [loading, setLoading] = useState(true);

  useEffect(() => {

    const timer = setTimeout(() => {

      setLoading(false);

    }, 1800);

    return () => clearTimeout(timer);

  }, []);

  if (!loading) return null;

  return (

    <div className="loader">

      <div className="spinner-border text-warning"></div>

    </div>

  );

}

export default Loader;