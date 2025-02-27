import { javascript } from "@codemirror/lang-javascript";
import { python } from "@codemirror/lang-python";
import { java } from "@codemirror/lang-java";
import { html } from "@codemirror/lang-html";
import { css } from "@codemirror/lang-css";
import { sql } from "@codemirror/lang-sql";
import { php } from "@codemirror/lang-php";
import { rust } from "@codemirror/lang-rust";

const LANGUAGES = [
    {
        name: "PYTHON",
        value: "python",
        logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg",
        extension: python
    },
    {
        name: "JAVASCRIPT",
        value: "javascript",
        logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg",
        extension: javascript
    },
    {
        name: "TYPESCRIPT",
        value: "typescript",
        logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg",
        extension: javascript
    },
    {
        name: "JAVA",
        value: "java",
        logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg",
        extension: java
    },
    {
        name: "C",
        value: "c",
        logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/c/c-original.svg",
        extension: null // No direct support in CodeMirror
    },
    {
        name: "C++",
        value: "cpp",
        logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg",
        extension: null // No direct support in CodeMirror
    },
    {
        name: "C#",
        value: "csharp",
        logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/csharp/csharp-original.svg",
        extension: null // No direct support in CodeMirror
    },
    {
        name: "PHP",
        value: "php",
        logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/php/php-original.svg",
        extension: php
    },
    {
        name: "RUBY",
        value: "ruby",
        logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/ruby/ruby-original.svg",
        extension: null // No direct support in CodeMirror
    },
    {
        name: "GO",
        value: "go",
        logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/go/go-original.svg",
        extension: null // No direct support in CodeMirror
    },
    {
        name: "RUST",
        value: "rust",
        logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/rust/rust-plain.svg",
        extension: rust
    },
    {
        name: "KOTLIN",
        value: "kotlin",
        logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/kotlin/kotlin-original.svg",
        extension: null // No direct support in CodeMirror
    },
    {
        name: "HTML",
        value: "html",
        logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg",
        extension: html
    },
    {
        name: "CSS",
        value: "css",
        logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg",
        extension: css
    },
    {
        name: "SQL",
        value: "sql",
        logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg",
        extension: sql
    },
    {
        name: "PERL",
        value: "perl",
        logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/perl/perl-original.svg",
        extension: null // No direct support in CodeMirror
    },
    {
        name: "SCALA",
        value: "scala",
        logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/scala/scala-original.svg",
        extension: null // No direct support in CodeMirror
    },
    {
        name: "HASKELL",
        value: "haskell",
        logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/haskell/haskell-original.svg",
        extension: null // No direct support in CodeMirror
    }
];

export default LANGUAGES;
