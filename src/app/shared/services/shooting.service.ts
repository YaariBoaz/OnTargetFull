import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject} from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ShootingService {
    selectedDrill;
    numberOfBullersPerDrill: number;
    BaseUrl;
    targets;
    targetsArrived = new BehaviorSubject(null);
    chosenTarget: any;

    constructor(private http: HttpClient) {
    }

    setBaseUrl(baseUrl) {
        this.BaseUrl = baseUrl;
    }

    setTargetsI() {
        if (this.getBaseUrl()) {
            this.http.get('http://' + this.getBaseUrl() + ':8087/api/GetTargets').subscribe((data: any) => {
                this.targets = JSON.parse(data);
                this.targetsArrived.next(this.targets);
            });
        }
    }

    getBaseUrl() {
        return this.BaseUrl;
    }

    getRecommendation(shots, centerCord) {
        let p = 0;
        const width = centerCord.X * 2;
        const heigth = centerCord.Y * 2;
        const intervalX = width / 3;
        const intervalY = heigth / 3;
        const squers = new Array<Square>();
        const s1: Square = {} as any;
        s1.A = new Point(0, 0);
        s1.B = new Point(intervalX, 0);
        s1.C = new Point(0, intervalY);
        s1.D = new Point(intervalX, intervalY);
        s1.Name = '1';
        s1.Recommendation = 'Too Little Trigger Finger';
        squers.push(s1);

        const s2: Square = {} as any;
        s2.A = s1.B;
        s2.B = new Point(intervalX * 2, 0);
        s2.C = s1.D;
        s2.D = new Point(intervalX * 2, intervalY);
        s2.Name = '2';
        s2.Recommendation = 'Pushing (Anticipating Recoil) Or No Follow-Through';
        squers.push(s2);

        const s3: Square = {} as any;
        s3.A = s2.B;
        s3.B = new Point(intervalX * 3, 0);
        s3.C = s2.D;
        s3.D = new Point(intervalX * 3, intervalY);
        s3.Recommendation = 'Heeling (Anticipating Recoil)';
        squers.push(s3);
        s3.Name = '3';

        const s4: Square = {} as any;
        s4.A = s1.C;
        s4.B = s1.D;
        s4.C = new Point(0, intervalY * 2);
        s4.D = new Point(intervalX, intervalY * 2);
        s4.Recommendation = 'Tightening Fingers';
        s4.Name = '4';
        squers.push(s4);

        const s5: Square = {} as any;
        s5.A = s2.C;
        s5.B = s2.D;
        s5.C = new Point(intervalX, intervalY * 2);
        s5.D = new Point(intervalX * 2, intervalY * 2);
        s5.Recommendation = 'Good Shooting';
        squers.push(s5);
        s5.Name = '5';

        const s6: Square = {} as any;
        s6.A = s3.C;
        s6.B = s3.D;
        s6.C = new Point(intervalX * 2, intervalY * 2);
        s6.D = new Point(intervalX * 3, intervalY * 2);
        s6.Recommendation = 'Thumbing( Squeezing Thumb) Or Too Much Trigger Finger';
        squers.push(s6);
        s6.Name = '6';

        const s7: Square = {} as any;
        s7.A = s4.C;
        s7.B = s4.D;
        s7.C = new Point(0, intervalY * 3);
        s7.D = new Point(intervalX, intervalY * 3);
        s7.Recommendation = 'Jerking Or Slapping Trigger';
        s7.Name = '7';
        squers.push(s7);

        const s8: Square = {} as any;
        s8.A = s5.C;
        s8.B = s5.D;
        s8.C = new Point(intervalX, intervalY * 3);
        s8.D = new Point(intervalX * 2, intervalY * 3);
        s8.Recommendation = 'Breaking Wrist Down, Pushing Forward Or Drooping Head';
        s8.Name = '8';

        squers.push(s8);
        const s9: Square = {} as any;
        s9.A = s6.C;
        s9.B = s6.D;
        s9.C = new Point(intervalX * 2, intervalY * 3);
        s9.D = new Point(intervalX * 3, intervalY * 3);
        s9.Recommendation = 'Tightening Grip While Pulling Trigger';
        s9.Name = '9';
        squers.push(s9);

        let count = -1;
        let s;
        // tslint:disable-next-line:prefer-for-of
        for (let i = 0; i < squers.length; i++) {
            const sq: Square = squers[i];
            const c = this.isInSquare(sq, shots);
            if (c >= count) {
                count = c;
                s = sq;
            }
        }

        p = count / shots.length;
        const res = new Recomondation(p, s.Recommendation);

        return res;
    }

    isInSquare(sq, list) {
        let count = 0;
        for (const item in list) {
            if (this.inSquare(sq, list[item])) {
                count++;
            }
        }
        return count;
    }

    inSquare(sq, hit) {
        if ((hit.x > sq.A.X && hit.x <= sq.B.X) && (hit.y >= sq.A.Y && hit.y <= sq.C.Y)) {
            return true;
        }
        return false;
    }


}

class Point {
    constructor(x: number, y: number) {
        this.X = x;
        this.Y = y;
    }

    X: number;
    Y: number;
}

export class Recomondation {
    constructor(x: number, y: string) {
        this.Probabilty = x;
        this.Recommendation = y;
    }

    Probabilty: number;
    Recommendation: string;
}

export class Square {

    A: Point;
    B: Point;
    C: Point;
    D: Point;
    Recommendation: string;
    Name: string;

    constructor(a: Point, b: Point, c: Point, d: Point) {
        this.A = a;
        this.B = b;
        this.C = c;
        this.D = d;
    }


}








