import typescript from "@rollup/plugin-typescript";
import postcss from "rollup-plugin-postcss";
import autoprefixer from "autoprefixer";
import cssnano from "cssnano";
import nodeResolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";

//Rollup and its plugins resolve from the toolkit's own node_modules one level up; TipTap resolves from this
//demo's. That is the whole reason this folder has a package.json of its own.
export default [
    {
        input: "src/index.ts",
        output: [
            {file: "dist.js", format: "iife", name: "Gradum"}
        ],
        plugins: [
            nodeResolve(),
            commonjs(),
            typescript({
                compilerOptions: {
                    "target": "ES2022",
                    "module": "ESNext",
                    "moduleResolution": "node",
                    "esModuleInterop": true,
                    "experimentalDecorators": false,
                    "emitDecoratorMetadata": false,
                    "useDefineForClassFields": true,
                    "forceConsistentCasingInFileNames": true,
                    "skipLibCheck": true,
                    "removeComments": false,
                }
            }),
            postcss({
                plugins: [autoprefixer(), cssnano()]
            })
        ]
    },
];
