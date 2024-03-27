

export const getCustomMapping = (theme: any):any => {

    return ({
        "components": {
          "Button": {
            "meta": {},
            "appearances": {
              "filled": {
                "mapping": {},
                "variantGroups": {
                  "status": {
                    "primary": {
                      "backgroundColor": theme["color-success-700"]
                    }
                  }
                } 
              }
            }
          }
        }
      })
}