export function makeMemberRows() {
    /*return  fetch('https://api.propublica.org/congress/v1/116/senate/members.json', {
      headers:{
        'X-API-Key': 'cdMF0sTt1HC9LAUb3dGVbzNlpL34aWtaoLyhdZ7w'
      }
    })*/
    return fetch("../src/senator.json")
      .then((resultado) => {
        return resultado.json();
      })
      .then((resultado) => {
        resultado.statistics = {};
        return resultado;
      });
  }
  
  export function makeCongresistasRows() {
    return fetch("../src/house.json")
      .then((resultado) => {
        return resultado.json();
      })
      .then((resultado) => {
        resultado.statistics = {};
  
        return resultado;
      });
  }
  export function loadStates() {
    return fetch("../src/states.json").then((resultado) => {
      return resultado.json();
    });
  }
  
  export function setCongresistas(miembros) {
    return filter(miembros).map((miembro) => {
      return `
         <tr>
             <td> 
             ${miembro.name}
             </td>
             <td>${miembro.party}</td>
             <td>${miembro.state}</td>
             <td>${miembro.seniority}</td>
             <td>${miembro.votes_with_party_pct}</td>
         </tr>
         `;
    });
  }
  export function setMembers(miembros) {
    return filter(miembros).map((miembro) => {
      return `
          <tr>
              <td><a href="https://www.facebook.com/${miembro.facebook_account}">${miembro.last_name} ${miembro.first_name}</a></td>
              <td>${miembro.party}</td>
              <td>${miembro.state}</td>
              <td>${miembro.seniority}</td>
              <td>${miembro.votes_with_party_pct}</td>
          </tr>
          `;
    });
  }
  export function makeCountRows(counts){
  return `
  <tr>
      <td>R</td>
      <td>${counts.R}</td>
  </tr>
  <tr>
      <td>D</td>
      <td>${counts.D}</td>
  </tr>
  <tr>
      <td>ID</td>
      <td>${counts.ID}</td>
  </tr>`
  }
  const parties = {
    D: "Democrat",
    R: "Republican",
    ID: "Independent",
  };
  
  export function filter(miembros) {
    const partiesCheckboxes = document.getElementsByName("parties");
    console.log(partiesCheckboxes);
  
    const miembrosFiltrados = miembros.filter((miembro) => {
      let verificador = false;
      for (let i = 0; i < partiesCheckboxes.length; i++) {
        const party = partiesCheckboxes[i];
        if (party.value === miembro.party) {
          verificador = party.checked;
        }
      }
      return verificador;
    });
  
    const selectState = document.getElementById("state").value;
  
    const miembrosFiltradosEstado = miembrosFiltrados.filter((miembro) => {
      let verificador = false;
      if (selectState && miembro.state === selectState) {
        verificador = true;
      }
      if (selectState === "") {
        verificador = true;
      }
      return verificador;
    });
    return miembrosFiltradosEstado;
  }
  
  export function calculateStatistics(miembros) {
    const resultado = miembros.reduce(
      (prev, next) => {
        if (next.party === "R") {
          return { ...prev, R: prev.R + 1 };
        } else if (next.party === "D") {
          return { ...prev, D: prev.D + 1 };
        } else {
          return { ...prev, ID: prev.ID + 1 };
        }
      },
      { R: 0, D: 0, ID: 0 }
    );
  
    console.log(resultado);
    return resultado;
  }
  