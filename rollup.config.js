import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import terser from '@rollup/plugin-terser';

export default {
  input: 'src/index.ts',
  output: [
    {
      file: 'dist/adelson-localization.cjs.js',
      format: 'cjs',
      sourcemap: true,
      exports: 'named'
    },
    {
      file: 'dist/adelson-localization.esm.js',
      format: 'esm',
      sourcemap: true
    },
    {
      file: 'dist/adelson-localization.umd.js',
      format: 'umd',
      name: 'AdelsonLocalization',
      sourcemap: true,
      globals: {
        react: 'React'
      }
    },
    {
      file: 'dist/adelson-localization.min.js',
      format: 'umd',
      name: 'AdelsonLocalization',
      sourcemap: true,
      globals: {
        react: 'React'
      },
      plugins: [terser()]
    }
  ],
  external: ['react'],
  plugins: [
    resolve(),
    commonjs(),
    typescript({
      tsconfig: './tsconfig.json',
      declaration: true,
      declarationDir: 'dist',
      rootDir: 'src'
    })
  ]
};
