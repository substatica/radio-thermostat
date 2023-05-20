## Radio Thermostat

This is a web interface to fetch the state and issue commands directly to a Radio Thermostat. It uses a minimal PHP backend to forward request to the thermostat. To install for production update config.php with the IP address of the thermostat and deploy the release zip files onto a PHP web server.

http://paypal.me/substatica

## Configure

For production update thermostat IP address here:

### `config.php`

For development update thermostat IP address here:

### `config.env`

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:8080](http://localhost:8080) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.