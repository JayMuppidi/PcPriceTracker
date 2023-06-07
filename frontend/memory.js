async function submit_data() {
  // console.log(document.getElementById("MSI").checked)
  output_data = {}
  if (document.getElementById("allBrands").checked) {
    output_data["companies"] = ["Adata","Corcair", "Crucial", "Gskill", "Antec", "Gigabyte"]
  }
  else {
    output_data["companies"] = []
    if (document.getElementById("Adata").checked)
      output_data["companies"].push("Adata")
    if (document.getElementById("Corcair").checked)
      output_data["companies"].push("Corcair")
    if (document.getElementById("Crucial").checked)
      output_data["companies"].push("Crucial")
    if (document.getElementById("Gskill").checked)
      output_data["companies"].push("Gskill")
    if (document.getElementById("Antec").checked)
      output_data["companies"].push("Antec")
    if (document.getElementById("Gigabyte").checked)
      output_data["companies"].push("Gigabyte")
  }
  if(output_data["companies"].length === 0) {
    output_data["companies"] = ["Adata","Corcair", "Crucial", "Gskill", "Antec", "Gigabyte"]
  }

  output_data["searchword"] = document.getElementById("searchBar").value
  output_data["freq"] = {
    "min": 2000,
    "max": 5000
  }
  output_data["sizes"] = {
    "min": 2,
    "max": 32
  }
  if (document.getElementById("lowerFreq").value !== "") {
    output_data["freq"]["min"] = document.getElementById("lowerFreq").value
  }
  if (document.getElementById("upperFreq").value !== "") {
    output_data["freq"]["max"] = parseInt(document.getElementById("upperFreq").value)
  }
  if (document.getElementById("lowerSize").value !== "") {
    output_data["sizes"]["min"] = document.getElementById("lowerSize").value
  }
  if (document.getElementById("upperSize").value !== "") {
    output_data["sizes"]["max"] = document.getElementById("upperSize").value
  }
  console.log(output_data)
  try {
    const response = await fetch('http://localhost:3000/api/memory', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body:
            JSON.stringify({ output_data })
    });
    const resp = await response.json();
    const data = resp.completedata
    document.getElementById('loader').style.display = 'none';
    return data;
  } catch (error) {
    document.getElementById('loader').style.display = 'none';
    document.getElementById('errorMessage').style.display = 'block';
      // console.error(error);
  }
}

function clearSearchBar() {
  document.getElementById("searchBar").value = "";
  displayMemory();
}


function createRow(memory) {
  let imgSrc = 'https://1000logos.net/wp-content/uploads/2017/03/LG-Symbol-500x368.jpg';
  // if (monitor.company.toLowerCase() === 'lg') {
  //   imgSrc = 'https://1000logos.net/wp-content/uploads/2017/03/LG-Symbol-500x368.jpg';
  // } else if (monitor.company.toLowerCase() === 'hp') {
  //   imgSrc = 'https://1000logos.net/wp-content/uploads/2021/04/HP-logo-500x286.png';
  // } else if (monitor.company.toLowerCase() === 'acer') {
  //   imgSrc = 'https://i.imgur.com/XCgsNpm.jpeg';
  // } else if (monitor.company.toLowerCase() === 'samsung') {
  //   imgSrc = 'https://i0.wp.com/www.getsims.com/wp-content/uploads/2018/03/samsung-logo-square.jpg?ssl=1';
  // } else if (monitor.company.toLowerCase() === 'dell') {
  //   imgSrc = 'https://logos-world.net/wp-content/uploads/2020/08/Dell-Logo-700x394.png';
  // } else if (monitor.company.toLowerCase() === 'viewsonic') {
  //   imgSrc = 'https://pbs.twimg.com/profile_images/879453453755351040/tb30Wqf-_400x400.jpg';
  // } else if (monitor.company.toLowerCase() === 'benq') {
  //   imgSrc = 'https://www.pngitem.com/pimgs/m/678-6782504_benq-logo-png-transparent-png.png';
  // } else if (monitor.company.toLowerCase() === 'asus') {
  //   imgSrc = 'https://icon2.cleanpng.com/20180626/coe/kisspng-laptop-graphics-cards-video-adapters-dell-asus-r-asus-logo-5b324523274b26.715148171530021155161.jpg';
  // } else if (monitor.company.toLowerCase() === 'gigabyte') {
  //   imgSrc = 'https://1000logos.net/wp-content/uploads/2020/05/Gigabyte-Logo.png';
  // } else if (monitor.company.toLowerCase() === 'msi') {
  //   imgSrc = 'https://cdn.dribbble.com/users/3144264/screenshots/16080159/media/76c03dd932c1e3f797c3fb5869826de9.png?compress=1&resize=450x338&vertical=top';
  // } else if (monitor.company.toLowerCase() === 'aoc') {
  //   imgSrc = 'https://1000logos.net/wp-content/uploads/2021/05/AOC-logo.png';
  // }
  let row = `
    <tr onclick="redirect('${memory.link}')" style="cursor: pointer;">
      <td>
      <div style="display: flex; align-items: center;">
          <img class="card-img-top" src="${imgSrc}" alt="${memory.company}" style="width: 60px; height: 50px; margin-right: 10px;">
          <span>${memory.company}</span>
        </div>
      </td>
      <td>${memory.name}</td>
      <td>${memory.modelid !== null && memory.modelid !== -1 ? `${memory.modelid} ` : ''}</td>
      <td>${memory.size !== null && memory.size !== -1 ? `${memory.size} ` : ''}</td>  
      <td>${memory.frequency !== null && memory.frequency !== -1 ? `${memory.frequency}` : ''}</td>
    </tr>
  `;
  return row;
}

function redirect(link) {
  console.log(link);
  window.location.href = link.startsWith('http') ? link : `http://${link}`;
}


async function displayMemory() {
  const memoryList = document.getElementById('memoryList');
  pList = await submit_data();
  let rows = '';
  pList.forEach(memory => {
  const row = createRow(memory);
  rows += row;
  });
  memoryList.innerHTML = `<div class="row">${rows}</div>`;
}


window.addEventListener("load", function() {
  displayMemory();
});


document.addEventListener("DOMContentLoaded", function() {
  document.getElementById("searchBar").addEventListener("keydown", function(event) {
    if (event.keyCode === 13) {
      event.preventDefault();
      displayMemory();
    }
  });
});

function sortTable(n) {
  document.getElementById('loader').style.display = 'block';
  var table, rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0;
  table = document.getElementById("memoryList");
  switching = true;
  dir = "asc";
  for(i=0;i<5;i++)
  {
    var header = document.getElementById("sortButton"+i);
    header.classList.remove("sort-up", "sort-down");
    if (header.childNodes.length > 1) {
      header.removeChild(header.childNodes[1]);
    }
  } 
  var header = document.getElementById("sortButton"+n);
  while (switching) {
    switching = false;
    rows = table.getElementsByTagName("TR");
    for (i = 0; i < (rows.length - 1); i++) {
      shouldSwitch = false;
      x = rows[i].getElementsByTagName("TD")[n];
      y = rows[i + 1].getElementsByTagName("TD")[n];
      var xValue = x.innerHTML.toLowerCase();
      var yValue = y.innerHTML.toLowerCase();
      if(n==0)
      {
        xValue = x.querySelector("span").textContent.toLowerCase();
        yValue = y.querySelector("span").textContent.toLowerCase();
      }
      if(n!= 0 && n!=1 && n!=2)
      {
        if(xValue!='')
        {
          xValue= parseInt(xValue)
        }
        if(yValue!='')
        {
          yValue= parseInt(yValue)
        }
      }
      if (xValue === '' && yValue === '') {
        continue; // If both values are empty, do nothing
      } else if (xValue === '') {
        shouldSwitch = true; // If x is empty, switch with y
        break;
      } else if (yValue === '') {
        shouldSwitch = false; // If y is empty, do nothing
        continue;
      } else if (dir == "asc") {
        if (xValue > yValue) {
          shouldSwitch = true;
          break;
        }
      } else if (dir == "desc") {
        if (xValue < yValue) {
          shouldSwitch = true;
          break;
        }
      }
    }
    if (shouldSwitch) {
      rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
      switching = true;
      switchcount++;
    } else {
      if (switchcount == 0 && dir == "asc") {
        dir = "desc";
        switching = true;
      }
    }
  }
  if (dir == "asc") {
    header.classList.add("sort-up");
    header.appendChild(document.createTextNode(" \u2191"));
  } else if (dir == "desc") {
    header.classList.add("sort-down");
    header.appendChild(document.createTextNode(" \u2193"));
  }
  document.getElementById('loader').style.display = 'none';
}
