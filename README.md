<p>
  <img src="https://assets.solidjs.com/banner?project=Library&type=solid-lightning" alt="SolidJS Lightning" />
</p>

# solid-lightning

Solid-Lightning is a UI framework for [Lightning Renderer](https://lightningjs.io/) built with [SolidJS](https://www.solidjs.com/) Universal Renderer. It allows you to declaratively construct lightning nodes with reactive primitives, just as you would construct a DOM tree in SolidJS. Also check out [Solid Lightning Primitives](https://github.com/lightning-js/solid-primitives) for additional primitives to speed up your development.

## Quick Start

Clone starter template:

```sh
> npx degit lightning-js/solid-starter-template my-app
> cd my-app
> npm i # or yarn or pnpm
> npm start # or yarn or pnpm
```

# Usage

Most of the things you do with Solid will carry over to using Solid-Lightning with some key differences as Lightning does not use HTML / DOM / CSS / Mouse Input.

### Hello World

```jsx
import { render, Canvas, Text } from '@lightningjs/solid';

render(() => (
  <Canvas>
    <Text>Hello World</Text>
  </Canvas>
));
```

## Built In Components

### Canvas

The <Canvas> element boots up the Lightning Renderer. This should be the first component passed into the render function. It takes an `options` param which is passed to the Lightning Renderer.

### View and Text

Everything is built with two primitive components: `<View>` and `<Text>`. Think of `<View>` like div tag for HTML, all encompassing. Whenever you want to display text, wrap it in a `<Text>` tag like so `<Text>Hello World</Text>`

```jsx
import { View, Text } from '@lightningjs/solid';
<View style={OverviewContainer}>
  <Text style={Title}>Hello World!</Text>
</View>;
```

## Focus / activeElement

activeElement is a global Solid Signal. At any time there is one element that can be the activeElement. You can also setActiveElement at any time to any element.

```jsx
import { createEffect, on } from "solid-js";
import { activeElement, setActiveElement } from "@lightningjs/solid";

// Get notified whenever the activeElement changes
createEffect(on(activeElement, (elm) => {
    focusRingRef.x = elm.x;
}, { defer: true}))

// autofocus will setActiveElement on this when intially created
<Button autofocus>TV Shows</Button>


let myButton;
onMount(() => {
  setActiveElement(myButton)
  //or
  myButton.setFocus();
})
<Button ref={myButton}>Sports</Button>
```

## Styling / Properties

You can add styles to your JSX components using object notation or applying the properties directly to the JSX or via a ref:

```jsx
import { createEffect, createSignal } from 'solid-js';

let columnRef;
const Column = {
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'flexStart',
  width: 1760,
  height: 500,
  gap: 50,
  y: 200,
  x: 80,
  color: '00000000',
};

createEffect(() => {
  columnRef.x = 200;
});

const [alpha, setAlpha] = createSignal(1);

<View ref={columnRef} alpha={alpha()} y={90} style={Column}>
  // ...add some children
</View>;
```

The style attribute takes an object of properties and passes them to the Lightning Renderer on initial creation of the component. The style object will not be reapplied if it is changed after creation. This keeps the style object as Read Only in the templating system allowing you to use it for multiple components. Additionally, when the style object is applied any properties on the JSX will have greater precedent so you can override styles on individual componets. After the component is created, you can further change props via signals or imperatively with the ref to the component.

### Required Props

<View> components require a width and height value. X and y will default to 0, 0 if not specified but are required by the renderer. <Text> component does not require any properties.

### Color

Can be HEX string ('#rrggbb') or ('#rrggbbaa') or RGBA number 0x00000000 or string 'RRGGBBAA'. I recommend installing [VS Code color picker](https://marketplace.visualstudio.com/items?itemName=AntiAntiSepticeye.vscode-color-picker) and using hex format to see the colors in VS Code.

### Border and borderRadius

`border` and `borderRadius` are special props which create effects for the DynamicShader found in the Lightning Renderer. These props can be set on the JSX or style object. The order in which you set the props determine how they are applied in the shader. Meaning you probably want to set borderRadius first. You can also set individual borders via `borderLeft`, `borderRight`, `borderTop`, `borderBottom`. These properties do not support animations.

```
const style = {
  borderRadius: 30,
  border: { width: 10, color: '#000000' }
}

// or

const style = {
  borderLeft: { width: 10, color: '#000000' },
  borderRight: { width: 10, color: '#000000' }
}

```

### linearGradient

`linearGradient` is another special effect that can be used like a style with following syntax.

```
linearGradient:
    {
      angle: 225,
      stops: [0.1, 0.5],
      colors: [
        0xff0000ff, 0x00000000,
      ],
    },
```

You can have as many stops or colors as you like.

## Layout

When a child element changes size onLayout will be called. You'll be notified with
`(node, { width, height})` of the element. You can use this callback to resize the parent node. If you do, call `parent.updateLayout`.

### Flex

At the moment there is a very barebone flex implementation (`display: flex`) made for one level of children. It only supports `flexDirection`, `justifyContent` and `gap` at the moment. But very useful for laying out rows and columns.

```jsx
import { View, Text } from '@lightningjs/solid';
import { Column, Row } from '@lightningjs/solid-primitives';
const RowStyles = {
  display: 'flex',
  justifyContent: 'flexStart',
  width: 1760,
  height: 300,
  gap: 26,
  y: 400,
};
<Row gap={12} style={RowStyles}>
  <Button autofocus>TV Shows</Button>
  <Button>Movies</Button>
  <Button>Sports</Button>
  <Button>News</Button>
</Row>;
```

Additionally, flex will automatically layout Text nodes. Anytime a View with display: flex has children which are text nodes it adds a listener for the text to load to set the width and height of the text elements and then calls updateLayout on the container to recalculate the flex layout.

```jsx
<View gap={10} style={OverviewContainer}>
  <Text style={Title}>{data().title || data().name}</Text>
  <Text style={Overview}>{data().overview}</Text>
  <View gap={8} style={SupportContainer}>
    <Text style={Subline}>Support Text</Text>
    <Text style={Subline}>{data().release_date}</Text>
    <View width={30} height={30} src={'/assets/rt-popcorn.png'}></View>
    <Text style={Subline}>90%</Text>
  </View>
</View>
```

## Animations

Adding an `animate` attribute to a <View> component will cause any property changes (after initial render) to be animated. This is useful for simple animations where you want to resize, move, or change alpha of a component. You can set `animationSettings` with an object to control the duration and timing function of property changes.

```jsx
createEffect(on(activeElement, (elm) => {
    focusRingRef.x = elm.x;
}, { defer: true}))

<FocusRing animate animationSettings={{duration: 1500}} ref={focusRingRef} />
```

You can also animate elements by setting their value to an array [newValue, animationSettings]; The second param is optional and will use the animationSettings on the JSX element or Config.animationSettings.

```jsx
let button;

onMount(() => {
  button.alpha = [1, { duration: 500 }];
});
<Button ref={button}>Movies</Button>;
```

For more complicated animations, you can access the Lightning renderer animate API directly:

```jsx
let button;

onMount(() => {
  button.animate({ alpha: 1 }, { duration: 500 });
});
<Button ref={button}>Movies</Button>;
```

### Global Animation Settings

You can set default animation settings for all transitions globally via Config.

```js
import { Config } from '@lightningjs/solid';
Config.animationSettings = {
  duration: 250,
  easing: 'ease-in-out',
};
```

## States

The style object can also be used to style components based on their state. You can add any keys with states you'd like applied like so:

```jsx
const Button = {
  width: 386,
  height: 136,
  color: '#546160',
  alpha: 0.5,
  scale: 1,
  focus: {
    color: '#58807d',
    scale: [1.1, { duration: 500 }],
    alpha: 1,
  },
  disabled: {
    color: '#333333',
  },
};
```

When Button is focused the focus styles will be applied. And when focus is removed, the original styles on the element will be set, meaning you need defaults on the original style to fallback to.

To apply a state to a component:

```jsx
<Button states={{ active: true, happy: false, disabled: false }}>Movies</Button>
<Button states={'active'}>Sports</Button>
<Button states='happy'>News</Button>
```

Or imperatively

```jsx
let myButton;

createEffect(() => {
  myButton.states.add('focus');

  // Check for a state
  if(myButton.states.has('focus')) {
    myButton.states.remove('focus')
  }

  myButton.states.add('disabled');
  // is and has are identical
  myButton.states.is('disabled');

  // toggle disabled on / off
  myButton.states.toggle('disabled');
})
<View ref={myButton} style={Button} />
```

The `focus` state is added and removed by the [useFocusManager](https://github.com/lightning-js/solid-primitives) primitive. Also note if elements are animating and another state is applied during the animation which uses the animated value (say alpha or color) - when that state is removed it will return to some value during the animation. Be careful not to set state with styles that are also being animated.

### forwardStates

When you want the state to also be applied to children elements, you can add `forwardStates` attribute to the parent element. Any states set on the parent will be add / removed from the children as well. This is useful for functional components where you need to change styles of children as well.

```jsx
function Button(props) {
  const ButtonContainer = {
    width: 386,
    height: 136,
    color: '#000000',
    alpha: 0.3,
    scale: 1,
    focus: {
      color: ['#58807d', { duration: 2000 }],
      scale: 1.2,
      alpha: [1, { duration: 1500, delay: 200, timing: 'easy-in' }],
    },
  };

  const ButtonText = {
    fontSize: 32,
    lineHeight: Button.height,
    contain: 'width',
    textAlign: 'center',
    mountY: -0.35,
    color: '#F6F6F9',
    height: Button.height,
    width: Button.width,
    focus: {
      color: '#FFFFFF',
    },
  };

  return (
    <View {...props} forwardStates animate style={ButtonContainer}>
      <Text style={ButtonText}>{props.children}</Text>
    </View>
  );
}
```

## Shaders and Effects

The shader prop allows you to specify a custom shader. Most of the common use ones have shortcuts like `borderRadius`, `border`.

```jsx
const RoundedRectangle = ['RoundedRectangle', { radius: 6 }];
function Button(props) {
  return (
    <View
      {...props}
      forwardStates
      animate
      style={buttonStyles.container}
      shader={RoundedRectangle}
    >
      <View style={buttonStyles.topBar} shader={RoundedRectangle}></View>
      <Text style={buttonStyles.text}>{props.children}</Text>
    </View>
  );
}
```

## Config

Allows setup of defaults for the app:

```js
import { Config } from '@lightningjs/solid';

// Log out solid rendering information
// This is removed for Prod builds for performance
Config.debug = false;

// Set defaults for all <Text>
Config.fontSettings.fontFamily = 'Ubuntu';
Config.fontSettings.color = 0xffffffff;
Config.fontSettings.fontSize = 100;
```
