export function makeMemberRows() {
  /*return  fetch('https://api.propublica.org/congress/v1/116/senate/members.json', {
      headers:{
        'X-API-Key': 'cdMF0sTt1HC9LAUb3dGVbzNlpL34aWtaoLyhdZ7w'
      }
    })*/
  return fetch("../scripts/senate.json")
    .then((resultado) => {
      return resultado.json();
    })
    .then((resultado) => {
      resultado.statistics = {};
      return resultado;
    });
}

export function makeCongresistasRows() {
  return fetch("../scripts/house.json")
    .then((resultado) => {
      return resultado.json();
    })
    .then((resultado) => {
      resultado.statistics = {};

      return resultado;
    });
}
export function loadStates() {
  return fetch("../scripts/states.json").then((resultado) => {
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
export function makeCountRows(counts) {
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
  </tr>`;
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
  const counts = miembros.reduce(
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

  let promAuxD = 0;
  let promAuxR = 0;
  let promAuxID = 0;
  const missed = miembros.reduce(
    (prev, next) => {
      if (next.party === "R") {
        promAuxR += 1;
        return { ...prev, R: prev.R + next.missed_votes };
      } else if (next.party === "D") {
        promAuxD += 1;
        return { ...prev, D: prev.D + next.missed_votes };
      } else {
        promAuxID += 1;
        return { ...prev, ID: prev.ID + next.missed_votes };
      }
    },
    { R: 0, D: 0, ID: 0 }
  );

  let promMostAuxD = 0;
  let promMostAuxR = 0;
  let promMostAuxID = 0;
  const mostLoyal = miembros.reduce(
    (prev, next) => {
      if (next.party === "R") {
        promMostAuxR += 1;
        return { ...prev, R: prev.R + next.votes_with_party_pct };
      } else if (next.party === "D") {
        promMostAuxD += 1;
        return { ...prev, D: prev.D + next.votes_with_party_pct };
      } else {
        promMostAuxID += 1;
        return { ...prev, ID: prev.ID + next.votes_with_party_pct };
      }
    },
    { R: 0, D: 0, ID: 0 }
  );

  let promLeastAuxD = 0;
  let promLeastAuxR = 0;
  let promLeastAuxID = 0;
  const leastLoyal = miembros.reduce(
    (prev, next) => {
      if (next.party === "R") {
        promLeastAuxR += 1;
        return { ...prev, R: prev.R + next.votes_against_party_pct };
      } else if (next.party === "D") {
        promLeastAuxD += 1;
        return { ...prev, D: prev.D + next.votes_against_party_pct };
      } else {
        promLeastAuxID += 1;
        return { ...prev, ID: prev.ID + next.votes_against_party_pct };
      }
    },
    { R: 0, D: 0, ID: 0 }
  );

  const last = miembros.filter(() => true);
  const tenPcr = Math.ceil(last.length * 0.1);
  last.sort((prev, next) => {
    if (prev.missed_votes_pct < next.missed_votes_pct) {
      return -1;
    } else {
      return 1;
    }
  });
  const last10pcr = last.slice(0, tenPcr - 1);
  last10pcr.sort((prev, next) => {
    if (prev.missed_votes_pct < next.missed_votes_pct) {
      return 1;
    } else {
      return -1;
    }
  });

  console.log({ promLeastAuxD, promLeastAuxR });
  return {
    mostLoyal: {
      R: mostLoyal.R && promMostAuxR ? mostLoyal.R / promMostAuxR : 0,
      D: mostLoyal.D && promMostAuxD ? mostLoyal.D / promMostAuxD : 0,
      ID: mostLoyal.ID && promMostAuxID ? mostLoyal.ID / promLeastAuxID : 0,
    },
    leastLoyal: {
      R: leastLoyal.R && promLeastAuxR ? leastLoyal.R / promLeastAuxR : 0,
      D: leastLoyal.D && promLeastAuxD ? leastLoyal.D / promLeastAuxD : 0,
      ID: leastLoyal.ID && promLeastAuxID ? leastLoyal.ID / promLeastAuxID : 0,
    },
    leastMembers: last10pcr,
    counts,
    missed: {
      R: missed.R / promAuxR,
      D: missed.D / promAuxD,
      ID: missed.ID / promAuxID,
    },
  };
}

export function makeMissedVoteRows(counts) {
  return `
    <tr>
        <td>R</td>
        <td>${counts.R.toFixed(2)}</td>
    </tr>
    <tr>
        <td>D</td>
        <td>${counts.D.toFixed(2)}</td>
    </tr>
    <tr>
        <td>ID</td>
        <td>${counts.ID.toFixed(2)}</td>
    </tr>`;
}

export function makeLeastMembersRows(members) {
  console.log(members);
  return members
    .map((member) => {
      return `<tr>
        <td>Member</td>
        <td>${member.last_name} ${member.first_name}</td>
    </tr>`;
    })
    .join("");
}
