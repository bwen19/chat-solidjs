import { onCleanup, Component, splitProps, For } from "solid-js";
import { createStore } from "solid-js/store";

// ========================// Hand //======================== //

type HandProps = {
  rotate: string;
  class: string;
  length: number;
  width: number;
  fixed?: boolean;
};

const Hand: Component<HandProps> = (props) => {
  const [local, rest] = splitProps(props, ["rotate", "length", "width", "fixed"]);
  return (
    <line
      y1={local.fixed ? local.length - 95 : undefined}
      y2={-(local.fixed ? 95 : local.length)}
      stroke="currentColor"
      stroke-width={local.width}
      stroke-linecap="round"
      transform={local.rotate}
      {...rest}
    />
  );
};

// ========================// Lines //======================== //

type LinesProps = {
  numberOfLines: number;
  class: string;
  length: number;
  width: number;
};

const Lines: Component<LinesProps> = (props) => {
  const [local, rest] = splitProps(props, ["numberOfLines"]);

  const rotate = (index: number, total: number) => `rotate(${(360 * index) / total})`;
  return <For each={new Array(local.numberOfLines)}>{(_, index) => <Hand rotate={rotate(index(), local.numberOfLines)} {...rest} fixed={true} />}</For>;
};

// ========================// Clock //======================== //

export const Clock: Component = () => {
  const [time, setTime] = createStore({ hour: "", minute: "", second: "" });
  const dispose = setInterval(() => {
    const d = new Date();
    const hr = d.getHours();
    const min = d.getMinutes();
    const sec = d.getSeconds();
    const hr_rotation = 30 * hr + min / 2; //converting current time
    const min_rotation = 6 * min;
    const sec_rotation = 6 * sec;

    setTime({ hour: `rotate(${hr_rotation})`, minute: `rotate(${min_rotation})`, second: `rotate(${sec_rotation})` });
  }, 1000);

  onCleanup(() => clearInterval(dispose));

  return (
    <div class="flex">
      <svg viewBox="0 0 200 200" width="95vh">
        <g transform="translate(100, 100)">
          {/* static */}
          <circle class="text-gray-800" r="99" fill="white" stroke="currentColor" stroke-width={2} />
          <Lines numberOfLines={60} class="text-gray-600" length={2} width={1} />
          <Lines numberOfLines={12} class="text-gray-700" length={5} width={2} />
          {/* dynamic */}
          <Hand rotate={time.hour} class="text-gray-900" length={50} width={4} />
          <Hand rotate={time.minute} class="text-gray-700" length={70} width={3} />
          <Hand rotate={time.second} class="text-red-700" length={80} width={2} />
        </g>
      </svg>
    </div>
  );
};
