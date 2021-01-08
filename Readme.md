## M133 Project Shop ##
Simon Krieger
S-INF-18aL
	
## Setup ##
To run this project, clone the repository & install deno from [here](https://deno.land/manual/getting_started/installation)

Run the Typescript to Javascript compiler from the Root Folder with the following command:

```
deno run --allow-read --allow-write --unstable ./tools/builder.ts
```

Run the Deno server from the Root Folder with this following command:

```
deno run --allow-net --allow-read ./src/webserver.ts
```

Open `http://localhost:8000`