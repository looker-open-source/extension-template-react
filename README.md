# Extension Template with React & Typescript

This repo serves as a template for developing Looker Extensions.

# Quick Start

1. Fork this repo
2. Clone a copy to your dev machine
3. Navigate to the `Extension Template`'s directory on your system
4. Enter the following commands (you may need to update your node version)
    ```
    yarn install
    yarn start
    ```

Great! Your extension is now running, but you can’t see it at the URL provided.
(default: `https://localhost:8080`)


__Important:__ If you go to the url you are running there may be a certificate warning. Go ahead and agree to that.
You will have to do this everytime you start up again with `yarn start`


5. Now login to looker and create a new __Blank Project__.
6. Navigate to the IDE in Looker.
7. In your fork of `extension_template` you have `manifest.lkml` file. You can either drag & upload this file into your Looker project, or create a `manifest.lkml` with the same content. Change the `id`, `label`, or `url` as needed.
 
```
application: extension-template {
  label: "Extension Template"
  url: "https://localhost:8080/bundle.js"
}
```

8. Create a `model` lookml file in your project. Give it any name. It is only used for permissioning.
    - Add a connection in this model. The specific connection doesn't matter.
    - Configure the model you created. https://docs.looker.com/data-modeling/getting-started/create-projects#configuring_a_model
  
9. We suggest creating an empty git repository and linking it to this project. This will be useful for deploying later.
    - Configure git from your Looker project to the new repository.
    - https://docs.looker.com/data-modeling/getting-started/setting-up-git-connection
    - #### Alternatively: You can configure a bare repository.

10. Commit and deploy your `model` and `manifest` to production.
11. Reload the page and click the `Browse` dropdown menu. You should see your extension in the list. (default: `Extension Template`)
    - Live reloading is not supported
    - BUT! While in `Developer Mode`, if you are using `url`, you can reload the page to see any changes you make to the underlying extension code.



## More information
 - code splitting is currently NOT supported


### Alternative development strategy
1. In your terminal you can build the extension with `yarn.build`.
2. Drag and drop the generated `bundle.js` file into your project via Looker
3. In your `manifest.lkml`, instead of `url`, use `file`.
```
application: extension-template {
  label: "Extension Template"
  file: "bundle.js"
}
```
