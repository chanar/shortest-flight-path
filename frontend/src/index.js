const myForm = document.forms[0];

myForm.addEventListener('submit', function (event) {
  event.preventDefault();
  const src = document.getElementById('departure').value
  const dst = document.getElementById('arrival').value
  const max = document.getElementById('maxflights').value

  getJSON(`/api/routes/path?src=${src}&dst=${dst}&maxflights=${max}`, function (err, data) {
    if (err) {
      return err;
    }

    data.then(function(res) {
      createFlightRoutes(res.data.flightRoutes)
    })
  });

});

function getIconPath(index, length) {
  let path = '';

  if (index === 1) {
    path = `
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
    `
  } else if (index === length) {
    path = `
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
    `
  } else {
    path = `
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
    `
  }

  return path;
}

function createFlightRoutes(routes) {
  const shortestRoute = routes.shortestRoute
  if(!shortestRoute) return;

  const routeChanges = routes.possibleRouteChanges

  const routesContainer = document.getElementById('flight-routes')
  routesContainer.innerHTML = ''

  const shortestRouteDivContainer = document.createElement('div')
  shortestRouteDivContainer.classList.add('grid', `lg:grid-cols-${shortestRoute.length}`, 'grid-cols-1', 'gap-4', 'mt-10')

  const shortestRouteTitleEl = document.createElement('h2')
  shortestRouteTitleEl.classList.add('text-center', 'text-2xl')
  shortestRouteTitleEl.innerHTML = 'Shortest route'

  shortestRoute.forEach(function(iata, index) {
    const airportHTML = `
      <div class="text-gray-700 text-center bg-gray-400">
        <div class="flex flex-row bg-white shadow-sm rounded p-4">
          <div class="flex items-center justify-center flex-shrink-0 h-12 w-12 rounded-xl bg-blue-100 text-blue-500">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              ${getIconPath(index+1, shortestRoute.length)}
            </svg>
          </div>
          <div class="flex items-center ml-4">
            <div class="font-semibold">${iata}</div>
          </div>
        </div>
      </div>
    `

    shortestRouteDivContainer.innerHTML += airportHTML;
  })

  routesContainer.appendChild(shortestRouteDivContainer)
  routesContainer.insertBefore(shortestRouteTitleEl, shortestRouteDivContainer)

  if (hasChanges(routeChanges)) {
    const routeChangeTitleEl = document.createElement('h2')
    routeChangeTitleEl.classList.add('text-center', 'text-2xl', 'mt-20')
    routeChangeTitleEl.innerHTML = 'Additional routes'
    routesContainer.appendChild(routeChangeTitleEl)

    Object.keys(routeChanges).forEach(function(iata) {
      let indexOfRoute = shortestRoute.lastIndexOf(iata)
      let newRoute = shortestRoute
      let some = newRoute.slice(0, indexOfRoute)

      routeChanges[iata].forEach(function(route) {
        const r = some.concat(route)

        const newRouteDivContainer = document.createElement('div')
        newRouteDivContainer.classList.add('grid', `lg:grid-cols-${r.length}`, 'grid-cols-1', 'gap-4', 'mt-10')

        r.forEach(function(iata, index) {
          const airportHTML = `
            <div class="text-gray-700 text-center bg-gray-400">
              <div class="flex flex-row bg-white shadow-sm rounded p-4">
                <div class="flex items-center justify-center flex-shrink-0 h-12 w-12 rounded-xl bg-blue-100 text-blue-500">
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    ${getIconPath(index+1, r.length)}
                  </svg>
                </div>
                <div class="flex items-center ml-4">
                  <div class="font-semibold">${iata}</div>
                </div>
              </div>
            </div>
          `

          newRouteDivContainer.innerHTML += airportHTML;
        })

        routesContainer.appendChild(newRouteDivContainer);
      })
    })
  }
}

function hasChanges (routeChanges) {
  if (Object.keys(routeChanges).length) {
    return true;
  }

  return false;
}

function getJSON(url, next) {
  fetch(url)
    .then(function (data) {
        if (data.status >= 200 && data.status < 300) {
            return data;
        }

        next(new Error('We reached our target server, but it returned an error.'));
    })
    .then(function (data) {
        next(null, data.json());
    })
    .catch(function () {
        next(new Error('There was a connection error of some sort.'));
    });
}
