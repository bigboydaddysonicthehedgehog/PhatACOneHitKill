// bigboydaddysonicthehedgehog

const DataView = require('buffer-dataview');
const hexy = require('hexy');
const dgram = require('dgram');
const readline = require('readline');

const server = dgram.createSocket('udp4');
const client = dgram.createSocket('udp4');
const HOST_IN = '127.0.0.1';
let PORT_IN
const search = 0x0000f7b100030000;
const ignoreList = [200, 63004, 63315, 63003];
const serverList = [
  ['Shofizzle', 'shofizzles.ddns.net', 9050],
  ['HighTide', 'hightide.damnserver.com', 3306],
  ['ReefCull', 'reefcull.damnserver.com', 3306],
  ['Shofizzle Permadeath', '174.57.66.185', 9080],
]
const portList = [6969, 6970]
const format = {
  format: 'eight',
  caps: 'upper'
};
let remote = null

function init() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });


  rl.question(`Which port?\n${portList.reduce((acc, val, i) => `${acc}${i + 1}: ${val}\n`, '')}`, (answer) => {
    PORT_IN = portList[parseInt(answer - 1)];
    rl.question(`Which server?\n${serverList.reduce((acc, val, i) => `${acc}${i + 1}: ${val[0]}\n`, '')}`, (answer) => {
      startServer(answer);
      rl.close();
    });
  });
}

function startServer(id) {
  server.on('message', (buffer, r) => {
    if (!remote) { remote = r }
    intercept(buffer)
    client.send(buffer, 0, buffer.length, serverList[id - 1][2], serverList[id - 1][1]);
  });

  client.on('message', (buffer) => {
    server.send(buffer, remote.port, remote.address)
  });

  server.bind(PORT_IN, HOST_IN);
  console.log(`Server started on ${HOST_IN}:${PORT_IN}`)
  console.log(`Server routing to ${serverList[id - 1][0]}, at ${serverList[id - 1][1]}:${serverList[id - 1][2]}`)
}

function handlePacket(dv, opcode) {
  if(opcode === 8) {
    let targetID = dv.getUint32(0, true);
    let height = dv.getUint32(4, true);
    let power = dv.getFloat32(8, true);
    dv.setFloat32(8, 70500, true);
  }
}

function intercept(buffer) {
  let pos = 0
  let k;
  let fragments = []
  while((k = buffer.indexOf('00000300B1F70000', pos, 'hex')) >= 0) {
    pos = k + 8
    fragments.push(pos)
  }
  for(let i = 0; i < fragments.length; i++) {
    let start = fragments[i] + 8;
    let opcode = buffer.readUInt32LE(start - 4);
    let end;
    if (i < fragments.length - 1) {
      end = fragments[i + 1]
    } else {
      end = buffer.length
    }
    if (ignoreList.indexOf(opcode) < 0) {
      console.log(`Fragment:`, `${opcode} (${opcode.toString(16)})`);
      console.log(hexy.hexy(buffer.slice(start, end), format));
      handlePacket(new DataView(buffer, start, end - start), opcode);
    }
  }
}

init();