import { configureAllowedScripts } from '@ministryofjustice/hmpps-npm-script-allowlist'

export default configureAllowedScripts({
   allowlist: {
     // Used by jest for running tests in watch mode
     "node_modules/fsevents@2.3.3": "FORBID",
     // Native solution to quickly resolve module paths, used by jest and eslint
     "node_modules/unrs-resolver@1.11.1": "ALLOW"
   },
  localScriptsToRun: ['prepare']
})
