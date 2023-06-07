async function submit_data() {
  // console.log(document.getElementById("MSI").checked)
  output_data = {}
  if (document.getElementById("allBrands").checked) {
    output_data["companies"] = ["LG", "HP", "Acer", "Samsung", "Dell", "Viewsonic", "Benq", "Asus", "Gigabyte", "MSI", "AOC"]
  }
  else {
    output_data["companies"] = []
    if (document.getElementById("LG").checked)
      output_data["companies"].push("LG")
    if (document.getElementById("HP").checked)
      output_data["companies"].push("HP")
    if (document.getElementById("Acer").checked)
      output_data["companies"].push("Acer")
    if (document.getElementById("Samsung").checked)
      output_data["companies"].push("Samsung")
    if (document.getElementById("Dell").checked)
      output_data["companies"].push("Dell")
    if (document.getElementById("Viewsonic").checked)
      output_data["companies"].push("Viewsonic")
    if (document.getElementById("Benq").checked)
      output_data["companies"].push("Benq")
    if (document.getElementById("Asus").checked)
      output_data["companies"].push("Asus")
    if (document.getElementById("Gigabyte").checked)
      output_data["companies"].push("Gigabyte")
    if (document.getElementById("MSI").checked)
      output_data["companies"].push("MSI")
    if (document.getElementById("AOC").checked)
      output_data["companies"].push("AOC")
  }
  if(output_data["companies"].length === 0) {
    output_data["companies"] = ["LG", "HP", "Acer", "Samsung", "Dell", "Viewsonic", "Benq", "Asus", "Gigabyte", "MSI", "AOC"]
  }

  output_data["searchword"] = document.getElementById("searchBar").value
  
  output_data["years"] = {
    "min": 2018,
    "max": 2023
  }
  output_data["brightness"] = {
    "min": 200,
    "max": 500
  }
  output_data["sizes"] = {
    "min": 15,
    "max": 50
  }
  if (document.getElementById("lowerYear").value !== "") {
    output_data["years"]["min"] = document.getElementById("lowerYear").value
  }
  if (document.getElementById("upperYear").value !== "") {
    output_data["years"]["max"] = document.getElementById("upperYear").value
  }
  if (document.getElementById("lowerBrightness").value !== "") {
    output_data["brightness"]["min"] = document.getElementById("lowerBrightness").value
  }
  if (document.getElementById("upperBrightness").value !== "") {
    output_data["brightness"]["max"] = document.getElementById("upperBrightness").value
  }
  if (document.getElementById("lowerSize").value !== "") {
    output_data["sizes"]["min"] = document.getElementById("lowerSize").value
  }
  if (document.getElementById("upperSize").value !== "") {
    output_data["sizes"]["max"] = document.getElementById("upperSize").value
  }
  console.log(output_data)
  try {
    const response = await fetch('http://localhost:3000/api/monitor', {
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
      console.error(error);
  }
}

function clearSearchBar() {
  document.getElementById("searchBar").value = "";
  displayMonitors();
}


function createRow(monitor) {
  let imgSrc = '';
  if (monitor.company.toLowerCase() === 'lg') {
    imgSrc = 'https://1000logos.net/wp-content/uploads/2017/03/LG-Symbol-500x368.jpg';
  } else if (monitor.company.toLowerCase() === 'hp') {
    imgSrc = 'https://1000logos.net/wp-content/uploads/2021/04/HP-logo-500x286.png';
  } else if (monitor.company.toLowerCase() === 'acer') {
    imgSrc = 'https://i.imgur.com/XCgsNpm.jpeg';
  } else if (monitor.company.toLowerCase() === 'samsung') {
    imgSrc = 'https://i0.wp.com/www.getsims.com/wp-content/uploads/2018/03/samsung-logo-square.jpg?ssl=1';
  } else if (monitor.company.toLowerCase() === 'dell') {
    imgSrc = 'https://logos-world.net/wp-content/uploads/2020/08/Dell-Logo-700x394.png';
  } else if (monitor.company.toLowerCase() === 'viewsonic') {
    imgSrc = 'https://pbs.twimg.com/profile_images/879453453755351040/tb30Wqf-_400x400.jpg';
  } else if (monitor.company.toLowerCase() === 'benq') {
    imgSrc = 'https://www.pngitem.com/pimgs/m/678-6782504_benq-logo-png-transparent-png.png';
  } else if (monitor.company.toLowerCase() === 'asus') {
    imgSrc = 'https://icon2.cleanpng.com/20180626/coe/kisspng-laptop-graphics-cards-video-adapters-dell-asus-r-asus-logo-5b324523274b26.715148171530021155161.jpg';
  } else if (monitor.company.toLowerCase() === 'gigabyte') {
    imgSrc = 'https://1000logos.net/wp-content/uploads/2020/05/Gigabyte-Logo.png';
  } else if (monitor.company.toLowerCase() === 'msi') {
    imgSrc = 'https://cdn.dribbble.com/users/3144264/screenshots/16080159/media/76c03dd932c1e3f797c3fb5869826de9.png?compress=1&resize=450x338&vertical=top';
  } else if (monitor.company.toLowerCase() === 'aoc') {
    imgSrc = 'https://1000logos.net/wp-content/uploads/2021/05/AOC-logo.png';
  }
  console.log(monitor.size_class)
  let row = `
    <tr onclick="redirect('${monitor.url}')" style="cursor: pointer;">
      <td>
      <div style="display: flex; align-items: center;">
          <img class="card-img-top" src="${imgSrc}" alt="${monitor.company}" style="width: 60px; height: 50px; margin-right: 10px;">
          <span>${monitor.company}</span>
        </div>
      </td>
      <td>${monitor.name}</td>
      <td>${monitor.modelid !== null && monitor.modelid !== -1 ? `${monitor.modelid} ` : ''}</td>
      <td>${monitor.resolution !== null && monitor.resolution !== -1 ? `${monitor.resolution} ` : ''}</td>
      <td>${monitor.model_year !== null && monitor.model_year !== -1 ? `${monitor.model_year}` : ''}</td>
      <td>${monitor.size_class !== null && monitor.size_class !== -1 ? `${monitor.size_class} ` : ''}</td>
      <td>${monitor.pixel_pitch !== null && monitor.pixel_pitch !== -1 ? `${monitor.pixel_pitch} ` : ''}</td>
      <td>${monitor.diagnol !== null && monitor.diagnol !== -1 ? `${monitor.diagnol} ` : ''}</td>  
      <td>${monitor.brightness !== null && monitor.brightness !== -1 ? `${monitor.brightness}` : ''}</td>
    </tr>
  `;
  return row;
}

function redirect(link) {
  console.log(link);
  window.location.href = link.startsWith('http') ? link : `http://${link}`;
}


async function displayMonitors() {
  const monitorList = document.getElementById('monitorList');
  pList = await submit_data();
  let rows = '';
  pList.forEach(monitor => {
  const row = createRow(monitor);
  rows += row;
  });
  for(i=0;i<9;i++)
  {
    var header = document.getElementById("sortButton"+i);
    header.classList.remove("sort-up", "sort-down");
    if (header.childNodes.length > 1) {
      header.removeChild(header.childNodes[1]);
    }
  } 
  monitorList.innerHTML = `<div class="row">${rows}</div>`;
}


window.addEventListener("load", function() {
  displayMonitors();
});


document.addEventListener("DOMContentLoaded", function() {
  document.getElementById("searchBar").addEventListener("keydown", function(event) {
    if (event.keyCode === 13) {
      event.preventDefault();
      displayMonitors();
    }
  });
});

function sortTable(n) {
  document.getElementById('loader').style.display = 'block';
  var table, rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0;
  table = document.getElementById("monitorList");
  switching = true;
  dir = "asc";
  for(i=0;i<9;i++)
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
      if(n!= 0 && n!=1 && n!=2 && n!=10)
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
