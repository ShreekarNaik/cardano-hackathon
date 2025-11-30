# Figma Details: Glass Buttons (Node 13:164)

- Source file: https://www.figma.com/design/6DesTCC4VTsixA6i9fC5EO/Untitled?node-id=13-164&m=dev
- File key: `6DesTCC4VTsixA6i9fC5EO`
- Node id: `13:164`
- Node name: `Glass Buttons`

## Metadata (XML)

```
<frame id="13:164" name="Glass Buttons" x="1457" y="622" width="1670" height="1093">
  <frame id="13:165" name="Pause" x="296" y="52" width="75" height="75">
    <frame id="13:170" name="Frame 14" x="24" y="66" width="0" height="32">
      <line id="13:166" name="Line 15" x="0" y="0" width="0" height="32" />
      <line id="13:169" name="Line 16" x="22" y="0" width="0" height="32" />
    </frame>
    <frame id="13:180" name="Frame 15" x="24" y="22" width="0" height="32">
      <line id="13:181" name="Line 15" x="0" y="0" width="0" height="32" />
      <line id="13:182" name="Line 16" x="22" y="0" width="0" height="32" />
    </frame>
  </frame>
  <frame id="13:197" name="Time Elapsed Label" x="63" y="182" width="370.5" height="97">
    <text id="13:212" name="00 : 01 : 23" x="27" y="27.5" width="231" height="42" />
    <frame id="13:205" name="Pause" x="284.5" y="11" width="75" height="75">
      <frame id="13:206" name="Frame 14" x="24" y="66" width="0" height="32">
        <line id="13:207" name="Line 15" x="0" y="0" width="0" height="32" />
        <line id="13:208" name="Line 16" x="22" y="0" width="0" height="32" />
      </frame>
      <frame id="13:209" name="Frame 15" x="24" y="22" width="0" height="32">
        <line id="13:210" name="Line 15" x="0" y="0" width="0" height="32" />
        <line id="13:211" name="Line 16" x="22" y="0" width="0" height="32" />
      </frame>
    </frame>
  </frame>
  <frame id="13:214" name="Job ID Label" x="476" y="183" width="357" height="97">
    <text id="13:215" name="JOB ID : 0xas123" x="27" y="27.5" width="307" height="42" />
  </frame>
  <frame id="13:172" name="Play" x="413" y="52" width="75" height="75" />
  <frame id="16:243" name="Circular Button" x="63" y="51" width="191" height="83">
    <symbol id="16:242" name="Property 1=Default" x="0" y="4" width="75" height="75" />
    <symbol id="16:246" name="Hovered State" x="116" y="4" width="75" height="75" />
  </frame>
  <frame id="18:2" name="context messages" x="1014" y="95" width="265" height="121">
    <text id="18:3" name="question" x="14" y="12" width="59" height="17" />
    <text id="18:4" name="answer goes here ..." x="14" y="37" width="134" height="17" />
    <boolean-operation id="18:18" name="expand" x="236" y="92" width="16" height="16" />
  </frame>
  <frame id="18:8" name="button" x="1022" y="240" width="222" height="53">
    <text id="18:9" name="generated text up up scrolling up up up up and up and up up up up" x="24" y="1" width="154" height="51" />
    <ellipse id="18:10" name="icon" x="178" y="8.5" width="36" height="36" />
  </frame>
  <frame id="18:27" name="Console Section" x="56" y="359" width="748" height="510">
    <frame id="18:28" name="Outline" x="56" y="359" width="748" height="510">
      <text id="18:29" name="Console" x="20" y="10" width="76" height="24" />
    </frame>
    <line id="18:30" name="Minimize" x="765" y="381" width="16" height="0.0000013987645388624514" />
    <line id="18:31" name="Divider" x="56" y="402" width="748" height="0.00006539223682011652" />
  </frame>
</frame>
```

## Design Context (Generated React + Tailwind Code)

```
const imgFrame14 = "https://www.figma.com/api/mcp/asset/613bfe4b-607d-480e-a03a-d0a94029b14d";
const imgFrame15 = "https://www.figma.com/api/mcp/asset/5fc8df20-3ce3-4472-b933-6fb126e1918a";
const imgPlay = "https://www.figma.com/api/mcp/asset/5c1d9938-6683-4fb1-b301-94876e3c3af2";
const imgExpand = "https://www.figma.com/api/mcp/asset/e693a3d4-bc8a-4811-9ba7-f8f0f9ef8f17";
const imgIcon = "https://www.figma.com/api/mcp/asset/27f2144d-f634-42f0-b274-609289664e9d";
const imgMinimize = "https://www.figma.com/api/mcp/asset/b909bdff-9c84-43fe-9cea-a0eccfafbc0b";
const imgDivider = "https://www.figma.com/api/mcp/asset/c763c2b9-92ca-4b9b-b4ba-2515e0ac1d2d";

export default function GlassButtons() {
  return (
    <div className="bg-black relative size-full" data-name="Glass Buttons" data-node-id="13:164">
      <div className="absolute bg-black border-[0.5px] border-solid border-white left-[296px] overflow-clip rounded-[12px] shadow-[0px_4px_40px_0px_rgba(255,255,255,0.1),0px_4px_12.5px_0px_rgba(255,255,255,0.08)] size-[75px] top-[52px]" data-name="Pause" data-node-id="13:165">
        <div className="absolute h-[32px] left-[23.5px] top-[65.5px] w-0" data-node-id="13:170">
          <div className="absolute inset-[-12.5%_-33px_-12.5%_-4px]">
            <img alt="" className="block max-w-none size-full" src={imgFrame14} />
          </div>
        </div>
        <div className="absolute h-[32px] left-[23.5px] top-[21.5px] w-0" data-node-id="13:180">
          <div className="absolute bottom-0 left-0 right-[-29px] top-0">
            <img alt="" className="block max-w-none size-full" src={imgFrame15} />
          </div>
        </div>
        <div className="absolute inset-0 pointer-events-none shadow-[inset_-1px_-2px_21.6px_-4px_rgba(255,255,255,0.29)]" />
      </div>
      <div className="absolute bg-black border-[0.5px] border-solid border-white left-[63px] rounded-[20px] top-[182px]" data-name="Time Elapsed Label" data-node-id="13:197">
        <div className="box-border content-stretch flex gap-[26.5px] items-center overflow-clip pl-[27px] pr-[11px] py-[11px] relative rounded-[inherit]">
          <p className="font-['JetBrains_Mono:Medium',sans-serif] font-medium leading-[normal] relative shrink-0 text-[32px] text-[rgba(255,255,255,0.75)]" data-node-id="13:212">
            00 : 01 : 23
          </p>
          <div className="bg-black border-[0.5px] border-solid border-white relative rounded-[12px] shrink-0 size-[75px]" data-name="Pause" data-node-id="13:205">
            <div className="overflow-clip relative rounded-[inherit] size-[75px]">
              <div className="absolute h-[32px] left-[24px] top-[66px] w-0" data-node-id="13:206">
                <div className="absolute inset-[-12.5%_-33px_-12.5%_-4px]">
                  <img alt="" className="block max-w-none size-full" src={imgFrame14} />
                </div>
              </div>
              <div className="absolute h-[32px] left-[24px] top-[22px] w-0" data-node-id="13:209">
                <div className="absolute bottom-0 left-0 right-[-29px] top-0">
                  <img alt="" className="block max-w-none size-full" src={imgFrame15} />
                </div>
              </div>
            </div>
            <div className="absolute inset-0 pointer-events-none shadow-[inset_-1px_-2px_21.6px_-4px_rgba(255,255,255,0.29)]" />
          </div>
        </div>
        <div className="absolute inset-0 pointer-events-none shadow-[inset_-1px_-2px_21.6px_-4px_rgba(255,255,255,0.29)]" />
      </div>
      <div className="absolute bg-black border-[0.5px] border-solid border-white h-[97px] left-[476px] rounded-[20px] top-[183px] w-[357px]" data-name="Job ID Label" data-node-id="13:214">
        <div className="box-border content-stretch flex gap-[26.5px] h-[97px] items-center overflow-clip pl-[27px] pr-[11px] py-[11px] relative rounded-[inherit] w-[357px]">
          <p className="font-['JetBrains_Mono:Medium',sans-serif] font-medium leading-[normal] relative shrink-0 text-[32px] text-[rgba(255,255,255,0.55)]" data-node-id="13:215">
            JOB ID : 0xas123
          </p>
        </div>
        <div className="absolute inset-0 pointer-events-none shadow-[inset_-1px_-2px_21.6px_-4px_rgba(255,255,255,0.29)]" />
      </div>
      <div className="absolute left-[413px] size-[75px] top-[52px]" data-name="Play" data-node-id="13:172">
        <div className="absolute inset-[-48%_-53.33%_-58.67%_-53.33%]">
          <img alt="" className="block max-w-none size-full" src={imgPlay} />
        </div>
      </div>
      <div className="absolute bg-black border-[0.5px] border-black border-solid h-[121px] left-[1014px] rounded-[12px] top-[95px] w-[265px]" data-name="context messages" data-node-id="18:2">
        <div className="box-border content-stretch flex flex-col gap-[8px] h-[121px] items-start overflow-clip pb-px pl-[14px] pr-[8px] pt-[12px] relative rounded-[inherit] w-[265px]">
          <p className="font-['Schibsted_Grotesk:SemiBold',sans-serif] font-semibold leading-[normal] overflow-ellipsis overflow-hidden relative shrink-0 text-[14px] text-white" data-node-id="18:3">
            question
          </p>
          <p className="font-['Schibsted_Grotesk:SemiBold',sans-serif] font-semibold leading-[normal] overflow-ellipsis overflow-hidden relative shrink-0 text-[14px] text-[rgba(255,255,255,0.7)]" data-node-id="18:4">{`answer goes here ... `}</p>
          <div className="absolute bottom-[13px] right-[13px] size-[16px]" data-name="expand" data-node-id="18:18">
            <img alt="" className="block max-w-none size-full" src={imgExpand} />
          </div>
        </div>
        <div className="absolute inset-0 pointer-events-none shadow-[inset_0px_-6px_16px_-2px_rgba(255,255,255,0.25),inset_0px_6px_4px_0px_rgba(0,0,0,0.45)]" />
      </div>
      <div className="absolute bg-black border-[0.5px] border-solid border-white left-[1022px] rounded-[80px] top-[240px]" data-name="button" data-node-id="18:8">
        <div className="box-border content-stretch flex items-center overflow-clip pl-[24px] pr-[8px] py-px relative rounded-[inherit]">
          <div className="-webkit-box bg-clip-text blur-[2.15px] filter font-['Schibsted_Grotesk:SemiBold',sans-serif] font-semibold h-[51px] leading-[normal] overflow-ellipsis overflow-hidden relative shrink-0 text-[14px] w-[154px] whitespace-pre-wrap" data-node-id="18:9" style={{ WebkitTextFillColor: "transparent" }}>
            <p className="mb-0">generated text up up scrolling up up up up</p>
            <p>and up and up up up up</p>
          </div>
          <div className="relative shrink-0 size-[36px]" data-name="icon" data-node-id="18:10">
            <img alt="" className="block max-w-none size-full" src={imgIcon} />
          </div>
        </div>
        <div className="absolute inset-0 pointer-events-none shadow-[inset_0px_-6px_16px_-2px_rgba(255,255,255,0.25),inset_0px_6px_4px_0px_rgba(0,0,0,0.45)]" />
      </div>
      <div className="absolute contents left-[56px] top-[359px]" data-name="Console Section" data-node-id="18:27">
        <div className="absolute bg-black border-[0.5px] border-solid border-white h-[510px] left-[56px] rounded-[20px] top-[359px] w-[748px]" data-name="Outline" data-node-id="18:28">
          <div className="box-border content-stretch flex flex-col gap-[9.5px] h-[510px] items-start overflow-clip pb-[11px] pt-[10px] px-[20px] relative rounded-[inherit] w-[748px]">
            <p className="font-['JetBrains_Mono:Medium',sans-serif] font-medium leading-[normal] relative shrink-0 text-[18px] text-[rgba(255,255,255,0.55)]" data-node-id="18:29">
              Console
            </p>
          </div>
          <div className="absolute inset-0 pointer-events-none shadow-[inset_-1px_-2px_21.6px_-4px_rgba(255,255,255,0.29)]" />
        </div>
        <div className="absolute h-0 left-[765px] top-[381px] w-[16px]" data-name="Minimize" data-node-id="18:30">
          <div className="absolute bottom-0 left-0 right-0 top-[-2px]">
            <img alt="" className="block max-w-none size-full" src={imgMinimize} />
          </div>
        </div>
        <div className="absolute h-0 left-[56px] top-[402px] w-[748px]" data-name="Divider" data-node-id="18:31">
          <div className="absolute bottom-0 left-0 right-0 top-[-1px]">
            <img alt="" className="block max-w-none size-full" src={imgDivider} />
          </div>
        </div>
      </div>
    </div>
  );
}
```

## Asset URLs

- `imgFrame14`: https://www.figma.com/api/mcp/asset/613bfe4b-607d-480e-a03a-d0a94029b14d
- `imgFrame15`: https://www.figma.com/api/mcp/asset/5fc8df20-3ce3-4472-b933-6fb126e1918a
- `imgPlay`: https://www.figma.com/api/mcp/asset/5c1d9938-6683-4fb1-b301-94876e3c3af2
- `imgExpand`: https://www.figma.com/api/mcp/asset/e693a3d4-bc8a-4811-9ba7-f8f0f9ef8f17
- `imgIcon`: https://www.figma.com/api/mcp/asset/27f2144d-f634-42f0-b274-609289664e9d
- `imgMinimize`: https://www.figma.com/api/mcp/asset/b909bdff-9c84-43fe-9cea-a0eccfafbc0b
- `imgDivider`: https://www.figma.com/api/mcp/asset/c763c2b9-92ca-4b9b-b4ba-2515e0ac1d2d

Note: Asset URLs expire in ~7 days per Figma MCP.

## Variables

```
{}
```

## Code Connect Map

```
{}
```

## Screenshot

A screenshot of node `13:164` was captured in this session (see chat). The screenshot API returned an inline image rather than a persistent URL.
