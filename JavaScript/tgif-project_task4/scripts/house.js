import {
  makeMemberRows,
  makeCongresistasRows,
  setMembers,
  setCongresistas,
  loadStates,
  calculateStatistics
} from "/scripts/html.js";

function start() {
  const params = new Proxy(new URLSearchParams(window.location.search), {
    get: (searchParams, prop) => searchParams.get(prop),
  });

  let chamber = params.chamber;
  if (chamber === "house") {
    document.getElementById('congressmen_info').style.display='block'
    makeCongresistasRows()
      .then((data) => {
        console.log(data)
        const miembros = data.results[0].members;

        const resultado = calculateStatistics(miembros)


        const tabla = document.getElementById("contenido_tabla");

        const html = setCongresistas(miembros);
        tabla.innerHTML = html.join("");
      })
      .catch((error) => {
        console.log(error);
      });
  } else {
    document.getElementById('senators_info').style.display='block'
    makeMemberRows()
      .then((data) => {
        console.log(data)
        const miembros = data.results[0].members;

        const resultado = calculateStatistics(miembros)



        const tabla = document.getElementById("contenido_tabla");

        const html = setMembers(miembros);
        tabla.innerHTML = html.join("");
      })
      .catch((error) => {
        console.log(error);
      });
  }
}
start();

const checkboxes = document.getElementsByName("parties");
for (let i = 0; i < checkboxes.length; i++) {
  const checkbox = checkboxes[i];
  checkbox.addEventListener("change", () => {
    start();
  });
}

const selectState = document.getElementById("state");
selectState.innerHTML = `<option ></option>`;
loadStates().then((data) => {
  makeMemberRows().then((miembros) => {
    for (const key in data) {
      if (Object.hasOwnProperty.call(data, key)) {
        const element = data[key];

        if (
          miembros.results[0].members.some((miembro) => miembro.state === key)
        ) {
          selectState.innerHTML += `
        <option value="${key}">${element}</option>
        `;
        }
      }
    }
  });
});
selectState.addEventListener("change", () => {
  start();
});
