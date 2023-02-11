import java.util.*;
public class main {
    public static void main() {
        int n, turn = 1;
        Scanner sc = new Scanner(System.in);
        n = sc.nextInt();
        int[] arr = new int[n];
        Map<Integer, Integer> mp = new HashMap<>();
        int temp;
        for (int i = 0; i < n; i++) {
            temp = sc.nextInt();
            arr[i] = temp;
        }
        Arrays.sort(arr);
        for (int i = n - 1; i >= 0; i--) {
            if (mp.containsKey(arr[i])) {
                mp.put(arr[i], mp.get(arr[i]) + 1);
            } else {
                mp.put(arr[i], 1);
            }
        }
        for (Map.Entry<Integer, Integer> entry : mp.entrySet()) {
            if (entry.getValue() % 2 == 1) {
                turn = 0;
                break;
            }
        }
        if (turn == 1) {
            System.out.println("Zenyk");
        } else {
            System.out.println("Marichka");
        }
    }
}