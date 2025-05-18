
<script lang="ts">
  import Status from '../lib/Status.svelte';

  type Observable<T> = (value: T) => void;
  type Status = 'idle' | 'running' | 'success' | 'failure';

  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
  interface Coordinator {
    generateCode(
      specs: string,
      onNewIteration: Observable<number>,
      onStatusChange: Observable<Status>,
      onGeneratedCode: Observable<string>
    ): void;
  }

  class FakeCoordinator {
     async generateCode(
       specs: string,
       onNewIteration: Observable<number>,
       onStatusChange: Observable<Status>,
       onGeneratedCode: Observable<string>
     ) {
       onStatusChange('running');

       for (let i = 1; i <= 3; i++) {
         await delay(1000);
         onNewIteration(i);
         onStatusChange('failure'); // si esto es temporal, cámbialo por lógica real
         onGeneratedCode(`// generated code, iteration ${i}`);
       }

       await delay(1000);
       onStatusChange('success');
     }
   }

const coordinator = new FakeCoordinator();


let specs = `
function testAdder() {
  const sut = new Adder(1, 2);
  assert(sut.result === 3);
}


testAdder();
`

let code = `
class Adder {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.result = x + y;
  }
}
  `;
let status:  'idle' | 'running' | 'failure' | 'success' = 'idle'
let iteration = 0;


 const run = async () => {
 code = '';
    iteration = 0;
    coordinator.generateCode(
      specs,
      (n) => iteration = n,
      (s) => status = s,
      (g) => code = g
    );
 }
</script>

<hstack class="container">
<vstack class="left">
    <hstack class="header">
        <spacer></spacer>
        <button id="run-button" on:click={run}>
        <svg width="16px" height="16px" viewBox="0 0 16 16" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
            <title>192x192@1x</title>
            <g id="192x192" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd" stroke-opacity="0.2">
                <path d="M0.5,0.666653887 C0.628730696,0.494303256 0.690292237,0.491999443 0.741049425,0.517211127 L14.5795474,7.43646119 L0.875736279,15.4033388 C0.814494445,15.3902172 0.759533368,15.3769038 0.710352553,15.3630835 Z" id="Trazado" stroke="#333333" fill="#C4C3BA" fill-rule="nonzero"></path>
            </g>
        </svg>
        </button>
    </hstack>
<textarea class="jet" bind:value={specs}></textarea>

</vstack>

<vstack class="right">
    <hstack class="header">
    <Status value={status}></Status>
    <spacer></spacer>

    {#if status !== 'idle'}
    <span id="count">{iteration}/5</span>
   {/if}
    </hstack>
<textarea class="jet" bind:value={code} readonly></textarea>

</vstack>
</hstack>

<style>
@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono&display=swap');
    button {
        border: 0;
        background: none;
    }
.container {
    border: 1px solid #ccc;
    font-size: 16px;
    position: relative;
    border-radius: 4px;
    overflow: hidden;

    font-family:
        ui-sans-serif,
        -apple-system,
        BlinkMacSystemFont,
        "Segoe UI",
        Roboto,
        sans-serif;
}
.header {
    height: 48px;
    padding: 0px 16px;
}


.jet {
    font-family: 'JetBrains Mono', monospace;
    font-size: 13px;
}
textarea {
    padding: 0;
    margin: 0;

    height: 300px;
    border: 0;
    padding: 0 16px;
    resize: none;
    background: none;
}

textarea:focus {
  outline: none;
}

vstack.left {
    background-color: #FFFFFE;
    border-right: 1px solid #ccc;
}

vstack.left .header {
    border-bottom: 1px solid #ccc;
}

vstack.right {
    background-color: #FFFFFA
}

button#run-button {
   cursor: pointer;
}

button#run-button:hover {
    opacity: 0.5;
}

#count {
    font-size: 13px;
}

hstack{display:flex;align-self:stretch;align-items:center;flex-direction:row}hstack[spacing=xl]>*{margin-right:40px}hstack[spacing=l]>*{margin-right:28px}hstack[spacing=m]>*{margin-right:20px}hstack[spacing=s]>*{margin-right:15px}hstack[spacing=xs]>*{margin-right:10px}hstack[spacing=xxs]>*{margin-right:6px}hstack[spacing]>:last-child{margin-right:0}hstack[align-y=top]{align-items:flex-start}hstack[align-y=center]{align-items:center}hstack[align-y=bottom]{align-items:flex-end}hstack[align-x=left]{justify-content:flex-start}hstack[align-x=center]{justify-content:center}hstack[align-x=right]{justify-content:flex-end}vstack{display:flex;align-self:stretch;flex:1 1 auto;flex-direction:column}vstack[spacing=xl]>*{margin-bottom:40px}vstack[spacing=l]>*{margin-bottom:28px}vstack[spacing=m]>*{margin-bottom:20px}vstack[spacing=s]>*{margin-bottom:15px}vstack[spacing=xs]>*{margin-bottom:10px}vstack[spacing=xxs]>*{margin-bottom:6px}vstack[spacing]>:last-child{margin-bottom:0}vstack[align-x=left]{align-items:flex-start}vstack[align-x=center]{align-items:center}vstack[align-x=right]{align-items:flex-end}vstack[align-y=top]{justify-content:flex-start}vstack[align-y=center]{justify-content:center}vstack[align-y=bottom]{justify-content:flex-end}list{display:flex;align-self:stretch;flex:1 1 auto;flex-direction:column}list>*{border-bottom:1px solid #d9ddde}list>*,list vstack{margin:0}list>:last-child{border-bottom:none}list[spacing=xl]>*{padding:40px 0}list[spacing=l]>*{padding:28px 0}list[spacing=m]>*{padding:20px 0}list[spacing=s]>*{padding:15px 0}list[spacing=xs]>*{padding:10px 0}list[spacing=xxs]>*{padding:6px 0}list[align-x=left]{align-items:flex-start}list[align-x=center]{align-items:center}list[align-x=right]{align-items:flex-end}list[align-y=top]{justify-content:flex-start}list[align-y=center]{justify-content:center}list[align-y=bottom]{justify-content:flex-end}spacer{flex:1}divider{background-color:#d9ddde;align-self:stretch}vstack>divider{margin:10px 0;height:1px}vstack[spacing]>divider{margin-top:0}hstack>divider{margin:0 10px;width:1px}hstack[spacing]>divider{margin-left:0}divider+list{margin-top:calc(-1*10px)}text{line-height:auto}text[font=title]{font-size:24px;font-weight:600}text[font=caption]{color:#999;font-size:13px}text[bold]{font-weight:700}text[underline=true],text[underline]{text-decoration:underline}text[underline=false]{text-decoration:none}view{display:flex;height:100%}.pylon{height:100%;padding:0;margin:0}[debug] *{outline:1px solid #009ddc!important}[stretch]{align-self:stretch;flex:1 1 auto}vstack[stretch]{height:100%}

</style>
