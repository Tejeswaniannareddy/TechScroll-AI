function renderInterestGraph(scores) {

    const container =
        document.getElementById(
            "interestGraph"
        );


    if (!container) {

        console.error(
            "interestGraph element not found"
        );

        return;
    }


    const entries =
        Object.entries(
            scores || {}
        )
        .sort(
            (a, b) =>
                Number(b[1]) -
                Number(a[1])
        )
        .slice(0, 6);


    if (
        entries.length === 0
    ) {

        container.innerHTML = `

            <div class="graph-placeholder">

                No interest scores returned yet.

            </div>

        `;

        return;
    }


    const max =
        Math.max(
            ...entries.map(
                item =>
                    Number(item[1]) || 0
            ),
            1
        );


    container.innerHTML = `

        <div class="graph-core">

            <div class="core-ring">

                <span>
                    AI
                </span>

            </div>

            <strong>
                Student
            </strong>

        </div>


        <div class="graph-lines">

            ${
                entries
                    .map(
                        ([name, value]) => {

                            const percentage =
                                Math.round(
                                    (
                                        Number(value) /
                                        max
                                    ) * 100
                                );


                            return `

                                <div
                                    class="graph-node"
                                >

                                    <div
                                        class="node-dot"
                                    ></div>


                                    <div
                                        class="node-info"
                                    >

                                        <strong>
                                            ${name}
                                        </strong>


                                        <div
                                            class="node-bar"
                                        >

                                            <span
                                                style="
                                                    width:${percentage}%;
                                                "
                                            ></span>

                                        </div>


                                        <small>
                                            Interest strength
                                            ${percentage}%
                                        </small>

                                    </div>

                                </div>

                            `;

                        }
                    )
                    .join("")
            }

        </div>

    `;
}


window.renderInterestGraph =
    renderInterestGraph;