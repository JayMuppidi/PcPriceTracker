async function submit_data() {
  output_data = {}
  if (document.getElementById("processorBrand").value === "All")
    output_data["companies"] = ["Intel", "AMD"]
  else if (document.getElementById("processorBrand").value === "Intel")
    output_data["companies"] = ["Intel"]
  else if (document.getElementById("processorBrand").value === "AMD")
    output_data["companies"] = ["AMD"]
  output_data["lowerCoreNum"]= 0
  output_data["upperCoreNum"]= 64
  output_data["lowerBaseClock"]= 0
  output_data["upperBaseClock"]= 5
  if (document.getElementById("lowerBaseClock").value !== "")
  {
    output_data["lowerBaseClock"] = document.getElementById("lowerBaseClock").value
  }
  if (document.getElementById("upperBaseClock").value !== "")
  {
    output_data["upperBaseClock"] = document.getElementById("upperBaseClock").value
  }
  if(document.getElementById("lowerCoreNum").value !== "")
  {
    output_data["lowerCoreNum"] = document.getElementById("lowerCoreNum").value
  }
  if(document.getElementById("upperCoreNum").value !== "")
  {
    output_data["upperCoreNum"] = parseInt(document.getElementById("upperCoreNum").value)
  }
  output_data["search"] = document.getElementById("searchBar").value
  try {
    const response = await fetch('http://localhost:3000/api/processor', {
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
  displayProcessors();
}


function createRow(processor) {
  let imgSrc = '';
  if (processor.company.toLowerCase() === 'amd') {
    imgSrc = 'https://i.imgur.com/u2DeebW.png';
  } else if (processor.company.toLowerCase() === 'intel') {
    imgSrc = 'https://i.imgur.com/cn0y1mS.png';
  }
  let row = `
    <tr onclick="redirect('${processor.link}')" style="cursor: pointer;">
      <td>
      <div style="display: flex; align-items: center;">
          <img class="card-img-top" src="${imgSrc}" alt="${processor.company}" style="width: 50px; height: 50px; margin-right: 10px;">
          <span>${processor.company}</span>
        </div>
      </td>
      <td>${processor.name}</td>
      <td>${processor.base_clock !== null && processor.base_clock !== -1 ? `${processor.base_clock} GHz` : ''}</td>
      <td>${processor.cache !== null && processor.cache !== -1 ? `${processor.cache} MB` : ''}</td>
      <td>${processor.num_cores !== null && processor.num_cores !== -1 ? `${processor.num_cores}` : ''}</td>
      <td>${processor.l1_cache !== null && processor.l1_cache > 0 ? `${processor.l1_cache} KB` : ''}</td>
      <td>${processor.l2_cache !== null && processor.l2_cache !== -1 ? `${processor.l2_cache} MB` : ''}</td>
      <td>${processor.l3_cache !== null && processor.l3_cache !== -1 ? `${processor.l3_cache} MB` : ''}</td>
      <td>${processor.socket !== null && processor.socket !== -1 ? `${processor.socket} MB` : ''}</td>
      <td>${processor.launch_date !== null && processor.launch_date !== -1 ? `${processor.launch_date}` : ''}</td>
      <td>${processor.mem_type !== null && processor.mem_type !== -1 ? `${processor.mem_type}` : ''}</td>
    </tr>
  `;
  return row;
}

function redirect(link) {
  console.log(link);
  window.location.href = link.startsWith('http') ? link : `http://${link}`;
}


async function displayProcessors() {
  const processorList = document.getElementById('processorList');
  pList = await submit_data();
  let rows = '';
  pList.forEach(processor => {
  const row = createRow(processor);
  rows += row;
  });
  processorList.innerHTML = `<div class="row">${rows}</div>`;
  for(i=0;i<11;i++)
  {
    var header = document.getElementById("sortButton"+i);
    header.classList.remove("sort-up", "sort-down");
    if (header.childNodes.length > 1) {
      header.removeChild(header.childNodes[1]);
    }
  } 
}


window.addEventListener("load", function() {
    displayProcessors();
});


document.addEventListener("DOMContentLoaded", function() {
  document.getElementById("searchBar").addEventListener("keydown", function(event) {
    if (event.keyCode === 13) {
      event.preventDefault();
      displayProcessors();
    }
  });
});

function sortTable(n) {
  var table, rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0;
  table = document.getElementById("processorList");
  switching = true;
  dir = "asc";
  for(i=0;i<11;i++)
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
      if(n!= 0 && n!=1 && n!=8 && n!=10)
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
}