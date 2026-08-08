import typescript from "@rollup/plugin-typescript";
import postcss from "rollup-plugin-postcss";
import autoprefixer from "autoprefixer";
import cssnano from "cssnano";
import nodeResolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";

export default [
    {
        input: "src/index.ts",
        output: [
            {file: "public/dist.bundle.js", format: "iife", name: "Turbo", sourcemap: true}
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
