"use strict";

function paint_flower_star() {
// Get the WebGL context.
    var canvas = document.getElementById('canvas_flower_star');
    var gl = canvas.getContext('experimental-webgl');

// Pipeline setup.
    gl.clearColor(.95, .95, .95, 1);
// Backface culling.
    gl.frontFace(gl.CCW);
//gl.enable(gl.CULL_FACE);
//gl.cullFace(gl.BACK)

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
        'gl_Position = vec4(pos/2.0, 1);' +
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
    var vertices, indicesLines, indicesTris;
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

// Setup constant color.
    var colAttrib = gl.getAttribLocation(prog, 'col');

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
    gl.vertexAttrib4f(colAttrib, 0, 1, 1, 1);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, iboTris);
    gl.drawElements(gl.TRIANGLES,
        iboTris.numberOfElements, gl.UNSIGNED_SHORT, 0);

// Setup rendering lines.
    gl.vertexAttrib4f(colAttrib, 0, 0, 1, 1);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, iboLines);
    gl.drawElements(gl.LINES,
        iboLines.numberOfElements, gl.UNSIGNED_SHORT, 0);

    function createVertexData() {
        var n = 100; //Anzahl der Ecken
        var m = 200; //Kreise
        // Positions.
        vertices = new Float32Array(3 * (n + 1) * (m + 1));
        // Index data.
        indicesLines = new Uint16Array(2 * 2 * n * m);
        indicesTris = new Uint16Array(3 * 2 * n * m);

        var du = 1 / n;
        var dv = 1 / m;
        // Counter for entries in index array.
        var iLines = 0;
        var iTris = 0;

        // Loop angle t.
        for (var i = 0, u = 0; i <= n; i++, u += du) {
            // Loop radius r.
            for (var j = 0, v = 0; j <= m; j++, v += dv) {

                var iVertex = i * (m + 1) + j;

                // Register the new function
                Math.constructor.prototype.sinh = sinh;
                Math.constructor.prototype.cosh = cosh;

                var a = Math.sin(2);
                var b = 5;
                var c = 2;
                var x = (a + Math.sin(b * Math.PI * u) * Math.sin(b * Math.PI * v)) * Math.sin(c * Math.PI * v);
                var y = (a + Math.sin(b * Math.PI * u) * Math.sin(b * Math.PI * v)) * Math.cos(c * Math.PI * v);
                var z = Math.cos(b * Math.PI * u) * Math.sin(b * Math.PI * v);

                // Set vertex positions
                vertices[iVertex * 3] = x;
                vertices[iVertex * 3 + 1] = y;
                vertices[iVertex * 3 + 2] = z;

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

// Add the sinh function to the Math object
    function sinh(x) {
        var sinh = 1 / 2 * (Math.exp(x) - Math.exp(-x));
        return sinh;
    }

// Add the cosh function to the Math object
    function cosh(x) {
        var cosh = 1 / 2 * (Math.exp(x) + Math.exp(-x));
        return cosh;
    }

}

// at loading event, initiate object imgData
window.addEventListener("load", paint_flower_star, true);