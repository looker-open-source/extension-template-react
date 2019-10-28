// The MIT License (MIT)

// Copyright (c) 2019 Looker Data Sciences, Inc.

// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:

// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.

import React from "react"
import { ILook } from "@looker/sdk"

export interface QueryProps {
  look?: ILook
  results?: string
  running: boolean
}

export const QueryContainer: React.FC<QueryProps> = (props) => (
  <div style={{ float: "left", width: "70vw", height: "auto", margin: "10 0 0 10" }}>
    <h4>
      Query:
      {props.look ? " " + props.look.title : ""}
    </h4>
    <textarea
      style={{ width: "90%", height: "80vh" }}
      value={props.running ? "Running Query ..." : props.results ? props.results : ""}
      readOnly
    />
  </div>
)
