# Avoid  error:0308010C:digital envelope routines::unsupported
export NODE_OPTIONS=--openssl-legacy-provider

npm run build:dev

# Use electron-packager to build the app to the .build/ folder
npm run electron