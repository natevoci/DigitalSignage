# Digital Signage Application

A React-based digital signage application for displaying events and other content.

## Prerequisites

- Node.js 16.x
- yarn package manager

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd DigitalSignage
```

2. Install dependencies:
```bash
yarn install
```

## Development

To start the development server:

```bash
yarn start
```

This will start the application in development mode. Open [http://localhost:1234](http://localhost:1234) to view it in your browser.

The page will reload when you make changes. You will also see any lint errors in the console.

## Building for Production

To create a production build:

```bash
yarn build
```

This builds the app for production to the `dist` folder. The build is not optimized by default as specified in the build script (--no-optimize flag is used).

## Technologies

- React 17.x
- Material-UI 5.x
- Emotion (for styled components)
- Parcel (for bundling)
- React Router 6.x

## Notes

- The application uses Parcel for bundling and development
- Material-UI is used for the component library
- Emotion is used for styling
- Node.js 16.x is required for optimal compatibility
