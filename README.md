# Postmate

Postmate is a desktop application for API testing and development, designed as an alternative to Postman with full compatibility for Postman collections.

## Features

- **Import Postman Collections**: Easily import your existing Postman collections
- **User-friendly Interface**: Clean, intuitive design for improved workflow
- **Request Builder**: Create and configure HTTP requests with support for different methods, headers, and body formats
- **Response Viewer**: View response data, headers, and status information
- **Collection Organization**: Organize your API requests into collections and folders

## Getting Started

### Prerequisites

- Node.js (version 14 or later)
- npm (comes with Node.js)

### Installation

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Run the application in development mode:
   ```
   npm run dev
   ```

### Building for Production

To build the application for production:

```
npm run build
npm run package
```

This will create distributable packages in the `dist` folder.

## Development

- **Main Process**: The main Electron process is defined in `main.js`
- **Renderer Process**: The React application is in the `src` directory
- **Webpack**: Used for bundling the renderer process

## License

This project is licensed under the ISC License.
