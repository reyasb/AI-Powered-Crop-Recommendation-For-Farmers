/*import java.util.*;
public class pra{
    public static void main(String[] args) {
        int[] arr={2,1,1,1,7,9,4,1};
        int[] ar2=new int[arr.length];
        int val=1;
        int j=0;
        int count=0;
        for(int i=0;i<arr.length;i++){
            if(arr[i]!=val){
                ar2[j]=arr[i];
                j++;
            }
            else{
                count++;
            }
        }
        System.out.print(Arrays.toString(ar2));
    }
}*/
//import java.util.*;
public class pra{
    public static void main(String[] args) {
    int[] num={1,3,5,7,9,11,13,15};
    int tar=9;
    int st=0;
    int end=num.length-1;
    while(st<end){
        int mid=(st+end)/2;
        if(num[mid]==tar){
            System.out.println("Found :"+mid);
            return;
        }
        else if(tar>num[mid]){
            st=mid+1;
        }
        else{
            end=mid-1;
        }
    }
}
}