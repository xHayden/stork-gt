import { Roboto } from "next/font/google";

const roboto = Roboto({ weight: "400", subsets: ["latin"] });

export default function Disclaimer() {
    return <div>
        <p className={`text-sm text-[#2c3755] ${roboto.className}`}>
            *Fantasy Stork League strictly probits illegal gambling as per <a className="border-b-2 border-indigo-900" href="https://policylibrary.gatech.edu/student-life/student-code-conduct">Georgia Tech Code of Conduct</a>.
        </p>
    </div>
}