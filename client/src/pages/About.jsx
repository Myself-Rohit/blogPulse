import React from "react";

function About() {
	return (
		<div className="flex items-center justify-center min-h-screen">
			<div className="max-w-2xl mx-auto p-3 text-center">
				<div>
					<h1 className="text-3xl font-semibold  text-center my-7">
						About Rohit's Blog
					</h1>
					<div className="text-md text-gray-500 flex flex-col gap-6">
						<p>
							Welcome to Rohit's Blog! This blog was created by Rohit Negi as a
							personal project to share his thoughts and ideas with the world.
							Rohit is a passionate developer who loves to write about
							technology, coding, and everything in between.
						</p>
						<p>
							On this blog, you'll find weekly articles on topics such as web
							development, software engineering, and programming languages.
							Rohit is always learning and exploring new technologies, so be
							sure to check back often for new content!
						</p>
						<p>
							I encourage you to leave comments on our posts and engage with
							other readers. You can like other people's comments and reply to
							them as well. I believe that a community of learners can help each
							other grow and improve.
						</p>
					</div>
				</div>
			</div>
		</div>
	);
}

export default About;
