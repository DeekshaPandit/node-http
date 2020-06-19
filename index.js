const http = require('http');


function getData() {
    const options = {
        host: '102.150.12.345',

        path: '/xyz',
        headers: { 'authorizationToken': 'your token' },
        method: 'GET'
    }

    const timings = {
        // use process.hrtime() as it's not a subject of clock drift
        startAt: process.hrtime(),
        dnsLookupAt: undefined,
        tcpConnectionAt: undefined,
        tlsHandshakeAt: undefined,
        firstByteAt: undefined,
        endAt: undefined
      }
    

    const req = http.request(options, function (response) {
        console.log(response);
        response.on('data', (d) => {
            console.log(d.toString());
        });

        response.once('readable', () => {
            timings.firstByteAt = process.hrtime(timings.startAt);
          })

          response.on('end', () => {
            timings.endAt = process.hrtime(timings.startAt);
            console.log(timings);
          })

    });

    req.on('error', (e) => {
        console.error(e);
    });

    req.on('timeout', () => {
        console.log("timed out");
    })

    req.on('socket', (socket) => {
        socket.on('lookup', () => {
          timings.dnsLookupAt = process.hrtime()
        })
        socket.on('connect', () => {
          timings.tcpConnectionAt = process.hrtime()
        })
        socket.on('secureConnect', () => {
          timings.tlsHandshakeAt = process.hrtime()
        })
      }) 
    

    req.end();
}

getData();
