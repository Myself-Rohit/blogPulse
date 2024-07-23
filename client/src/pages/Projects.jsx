import React from "react";
import CallToAction from "../components/CallToAction";

function Projects() {
	return (
		<div className="min-h-screen max-w-2xl mx-auto flex justify-center gap-6 items-center flex-col">
			<h1 className="text-3xl font-semibold">Projects</h1>
			<p className="text-md text-gray-500">
				Build fun and engaging projects while learning HTML, CSS, and
				JavaScript!
			</p>
			<CallToAction />
		</div>
	);
}

export default Projects;
