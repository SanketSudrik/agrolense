import {
  MAT_SELECT_CONFIG,
  MAT_SELECT_SCROLL_STRATEGY,
  MAT_SELECT_SCROLL_STRATEGY_PROVIDER,
  MAT_SELECT_SCROLL_STRATEGY_PROVIDER_FACTORY,
  MAT_SELECT_TRIGGER,
  MatSelect,
  MatSelectChange,
  MatSelectModule,
  MatSelectTrigger
} from "./chunk-R2ZFJZ43.js";
import "./chunk-E4OMQ5YH.js";
import {
  MatError,
  MatFormField,
  MatHint,
  MatLabel,
  MatPrefix,
  MatSuffix
} from "./chunk-563NNQEC.js";
import "./chunk-WPJDW76A.js";
import "./chunk-CRFJZIYW.js";
import "./chunk-DDGA7OUM.js";
import {
  MatOptgroup,
  MatOption
} from "./chunk-ZYZYQI7R.js";
import "./chunk-4NKF2CHZ.js";
import "./chunk-EXLTYRUX.js";
import "./chunk-Z3SXPJ4B.js";
import "./chunk-KA244H5P.js";
import "./chunk-XUVQH7I3.js";
import "./chunk-KEYUTJB4.js";
import "./chunk-VJ5W7655.js";
import "./chunk-DFNHDZJY.js";
import "./chunk-VENV3F3G.js";
import "./chunk-T7YVJ26U.js";
import "./chunk-46HAYV32.js";
import "./chunk-2UXPEGFP.js";
import "./chunk-7TINR4GN.js";
import "./chunk-42DYWLH4.js";
import "./chunk-JQJ54CCQ.js";
import "./chunk-C4TOZELM.js";
import "./chunk-5EG33CFQ.js";
import "./chunk-5A6XKZ47.js";
import "./chunk-EFSEM6M2.js";
import "./chunk-7BJTLQE6.js";
import "./chunk-VCSY3EBV.js";
import "./chunk-VI4S7AUY.js";
import "./chunk-EFUI5DNY.js";
import "./chunk-TPNNASRB.js";
import "./chunk-HWYXSU2G.js";
import "./chunk-JRFR6BLO.js";
import "./chunk-MARUHEWW.js";
import "./chunk-WDMUDEB6.js";

// node_modules/@angular/material/fesm2022/select.mjs
var matSelectAnimations = {
  // Represents
  // trigger('transformPanel', [
  //   state(
  //     'void',
  //     style({
  //       opacity: 0,
  //       transform: 'scale(1, 0.8)',
  //     }),
  //   ),
  //   transition(
  //     'void => showing',
  //     animate(
  //       '120ms cubic-bezier(0, 0, 0.2, 1)',
  //       style({
  //         opacity: 1,
  //         transform: 'scale(1, 1)',
  //       }),
  //     ),
  //   ),
  //   transition('* => void', animate('100ms linear', style({opacity: 0}))),
  // ])
  /** This animation transforms the select's overlay panel on and off the page. */
  transformPanel: {
    type: 7,
    name: "transformPanel",
    definitions: [
      {
        type: 0,
        name: "void",
        styles: {
          type: 6,
          styles: { opacity: 0, transform: "scale(1, 0.8)" },
          offset: null
        }
      },
      {
        type: 1,
        expr: "void => showing",
        animation: {
          type: 4,
          styles: {
            type: 6,
            styles: { opacity: 1, transform: "scale(1, 1)" },
            offset: null
          },
          timings: "120ms cubic-bezier(0, 0, 0.2, 1)"
        },
        options: null
      },
      {
        type: 1,
        expr: "* => void",
        animation: {
          type: 4,
          styles: { type: 6, styles: { opacity: 0 }, offset: null },
          timings: "100ms linear"
        },
        options: null
      }
    ],
    options: {}
  }
};
export {
  MAT_SELECT_CONFIG,
  MAT_SELECT_SCROLL_STRATEGY,
  MAT_SELECT_SCROLL_STRATEGY_PROVIDER,
  MAT_SELECT_SCROLL_STRATEGY_PROVIDER_FACTORY,
  MAT_SELECT_TRIGGER,
  MatError,
  MatFormField,
  MatHint,
  MatLabel,
  MatOptgroup,
  MatOption,
  MatPrefix,
  MatSelect,
  MatSelectChange,
  MatSelectModule,
  MatSelectTrigger,
  MatSuffix,
  matSelectAnimations
};
//# sourceMappingURL=@angular_material_select.js.map
