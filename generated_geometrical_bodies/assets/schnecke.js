"use strict";

function paint_schnecke() {
// Get the WebGL context.
    var canvas = document.getElementById('canvas_schnecke');
    var gl = canvas.getContext('experimental-webgl');

// Pipeline setup.
    gl.clearColor(.95, .95, .95, 1);
// Backface culling.
    gl.frontFace(gl.CCW);
//gl.enable(gl.CULL_FACE);
    gl.cullFace(gl.BACK)

    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);
    gl.enable(gl.POLYGON_OFFSET_FILL);
    gl.polygonOffset(1.0, 1.0);
// ...
// ...
// ...
// ...
// ...
// ...

// Compile vertex shader.
    var vsSource = '' +
        'attribute vec3 pos;' +
        'attribute vec4 col;' +
        'varying vec4 color;' +
        'void main(){' + 'color = col;' +
        'gl_Position = vec4(pos/3.0, 1);' +
        '}';
    var vs = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vs, vsSource);
    gl.compileShader(vs);

// Compile fragment shader.
    var fsSouce = 'precision mediump float;' +
        'varying vec4 color;' +
        'void main() {' +
        'gl_FragColor = color;' +
        '}';
    var fs = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fs, fsSouce);
    gl.compileShader(fs);

// Link shader together into a program.
    var prog = gl.createProgram();
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.bindAttribLocation(prog, 0, "pos");
    gl.linkProgram(prog);
    gl.useProgram(prog);

// Vertex data.
// Positions, Index data.
    var vertices, indicesLines, indicesTris, colors;
// Fill the data arrays.
    createVertexData();

// Setup position vertex buffer object.
    var vboPos = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vboPos);
    gl.bufferData(gl.ARRAY_BUFFER,
        vertices, gl.STATIC_DRAW);
// Bind vertex buffer to attribute variable.
    var posAttrib = gl.getAttribLocation(prog, 'pos');
    gl.vertexAttribPointer(posAttrib, 3, gl.FLOAT,
        false, 0, 0);
    gl.enableVertexAttribArray(posAttrib);

    // Setup color vertex buffer object.
    var vboCol = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vboCol);
    gl.bufferData(gl.ARRAY_BUFFER, colors, gl.STATIC_DRAW);

// Setup constant color.
    var colAttrib = gl.getAttribLocation(prog, 'col');
    gl.vertexAttribPointer(colAttrib, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(colAttrib);

// Setup lines index buffer object.
    var iboLines = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, iboLines);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,
        indicesLines, gl.STATIC_DRAW);
    iboLines.numberOfElements = indicesLines.length;
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

// Setup tris index buffer object.
    var iboTris = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, iboTris);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,
        indicesTris, gl.STATIC_DRAW);
    iboTris.numberOfElements = indicesTris.length;
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

// Clear framebuffer and render primitives.
    gl.clear(gl.COLOR_BUFFER_BIT);

// Setup rendering tris.
//    gl.vertexAttrib4f(colAttrib, 0, 1, 1, 1);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, iboTris);
    gl.drawElements(gl.TRIANGLES,
        iboTris.numberOfElements, gl.UNSIGNED_SHORT, 0);

// Setup rendering lines.
//    gl.vertexAttrib4f(colAttrib, 0, 0, 1, 1);
    gl.disableVertexAttribArray(colAttrib);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, iboLines);
    gl.drawElements(gl.LINES,
        iboLines.numberOfElements, gl.UNSIGNED_SHORT, 0);

    function createVertexData() {
        var n = 120; //Anzahl der Ecken
        var m = 70; //Kreise
        // Positions.
        vertices = new Float32Array(3 * (n + 1) * (m + 1));
        colors = new Float32Array((3 * (n + 1) * (m + 1))*4);
        // Index data.
        indicesLines = new Uint16Array(2 * 2 * n * m);
        indicesTris = new Uint16Array(3 * 2 * n * m);

        var du = 5 * Math.PI / n;
        var dv = 2 * Math.PI / m;
        // Counter for entries in index array.
        var iLines = 0;
        var iTris = 0;

        // Loop angle t.
        for (var i = 0, u = 0; i <= n; i++, u += du) {
            // Loop radius r.
            for (var j = 0, v = 0; j <= m; j++, v += dv) {

                var iVertex = i * (m + 1) + j;
                var a = 1;
                var b = 3;
                var h = Math.exp(u / (6 * Math.PI));
                var x = a * (1 - h) * Math.cos(u) * Math.cos(0.5 * v) * Math.cos(0.5 * v);
                var y = 1 - Math.exp(u / (b * Math.PI)) - Math.sin(v) + h * Math.sin(v) + 3;
                var z = a * (-1 + h) * Math.sin(u) * Math.cos(0.5 * v) * Math.cos(0.5 * v);

                // Set vertex positions
                vertices[iVertex * 3] = x / 0.75;
                vertices[iVertex * 3 + 1] = (y + 0.25) * 0.75;
                vertices[iVertex * 3 + 2] = z;

                // Set color

                if(v >= 0 && v < (0.5 * Math.PI)){
                    colors[iVertex * 4] = Math.sin(v);
                    colors[iVertex * 4 + 1] = 1-Math.sin(v);
                    colors[iVertex * 4 + 2] = 1;
                    colors[iVertex * 4 + 3] = 1;
                }
                if(v >= (0.5 * Math.PI) && v < Math.PI){
                    colors[iVertex * 4] = 0.5;
                    colors[iVertex * 4 + 1] = Math.sin(v);
                    colors[iVertex * 4 + 2] = Math.sin(v);
                    colors[iVertex * 4 + 3] = 1;
                }
                if(v >= Math.PI && v < (1.5 * Math.PI)){
                    colors[iVertex * 4] = 1;
                    colors[iVertex * 4 + 1] = Math.sin(v);
                    colors[iVertex * 4 + 2] = 1-Math.sin(v);
                    colors[iVertex * 4 + 3] = 1;
                }
                if(v >= (1.5 * Math.PI)){
                    colors[iVertex * 4] = Math.sin(v);
                    colors[iVertex * 4 + 1] = 1-Math.sin(v);
                    colors[iVertex * 4 + 2] = 1-Math.sin(v);
                    colors[iVertex * 4 + 3] = 1;
                }

                // Set index.
                // Line on beam.
                if (j > 0 && i > 0) {
                    indicesLines[iLines++] = iVertex - 1;
                    indicesLines[iLines++] = iVertex;
                }
                // Line on ring.
                if (j > 0 && i > 0) {
                    indicesLines[iLines++] = iVertex - (m + 1);
                    indicesLines[iLines++] = iVertex;
                }

                // Set index.
                // Two Triangles.
                if (j > 0 && i > 0) {
                    indicesTris[iTris++] = iVertex;
                    indicesTris[iTris++] = iVertex - 1;
                    indicesTris[iTris++] = iVertex - (m + 1);
                    //
                    indicesTris[iTris++] = iVertex - 1;
                    indicesTris[iTris++] = iVertex - (m + 1) - 1;
                    indicesTris[iTris++] = iVertex - (m + 1);
                }
            }
        }
    }

}

// at loading event, initiate object imgData
window.addEventListener("load", paint_schnecke, true);