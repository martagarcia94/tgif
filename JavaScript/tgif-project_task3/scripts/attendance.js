import {
    makeCountRows,
    makeCongresistasRows,
    makeMemberRows,
    calculateStatistics
  } from "/scripts/html.js";
  function start() {
    const params = new Proxy(new URLSearchParams(window.location.search), {
      get: (searchParams, prop) => searchParams.get(prop),
    });
  
    let chamber = params.chamber;
    if (chamber === "senate") {
      document.getElementById("senate").style.display = "block";
      makeMemberRows()
        .then((data) => {
          console.log(data);
          const miembros = data.results[0].members;
          const resultado = calculateStatistics(miembros);
          const html = makeCountRows(resultado);
          const tabla = document.getElementById("contenido_tabla");
          tabla.innerHTML = html;
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      document.getElementById("house").style.display = "block";
  
      makeCongresistasRows()
        .then((data) => {
          console.log(data);
          const miembros = data.results[0].current_members;
          const resultado = calculateStatistics(miembros);
          const html = makeCountRows(resultado);
          const tabla = document.getElementById("contenido_tabla");
          tabla.innerHTML = html;
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }
  start();
  