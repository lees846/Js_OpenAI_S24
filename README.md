# Js_OpenAI_S24

This is Shayla's Repository for the JavaScript + OpenAI API's course at Parsons,
taught by Justin Bakse in Spring 2024.

# Get Things Running

## GPT

The Js_OpenAI_S24 repo uses the GPT API from OpenAI, to run this you need to add
your own `.env` file in the `src` folder. The only thing the file needs is
`OPENAI_API_KEY=` followed by your API key (this should not be a string).

## Deno

To run a file, you must be in the root directory `Js_OpenAI_S24 %` and can then
type `deno run -A {filepath}`. Note that `-A` gives deno access to your files,
without it you can accept or reject each prompt on an individual basis.
